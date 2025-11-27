using System;
using System.Collections.Generic;
using System.Linq;
using Dapper;
using Domain.Model;
using Newtonsoft.Json;
using Npgsql;
using Serilog;

namespace Infrastructure.Repository
{
  public class CollaboratorRepository : ICollaboratorRepository
  {
    private readonly string _connectionString;
    private readonly ILogger _logger;
    private readonly IUserRepository _userRepository;
    public CollaboratorRepository(string connectionString, ILogger logger)
    {
      _connectionString = connectionString;
      _logger = logger;
    }

    public Collaborator CreateCollaborator(CreateCollaboratorRequest createCollaboratorRequest)
    {
      using (var connection = new NpgsqlConnection(_connectionString))
      {
        connection.Open();
        var transaction = connection.BeginTransaction();
        try
        {

          var sqlGetRole = @$"SELECT * FROM authentication.role WHERE tag = '{createCollaboratorRequest.RoleName.ToString()}';";
          var role = connection.Query<Role>(sqlGetRole).FirstOrDefault();

          var sqlInsertUser = $@"INSERT INTO authentication.user (email, password, role_id, active, password_generated)
            VALUES('{createCollaboratorRequest.Email}',  '{createCollaboratorRequest.Password}', '{role.Role_id}', true, true) RETURNING *;";
          var insertedUser = connection.Query<Credentials>(sqlInsertUser).FirstOrDefault();

          var sqlInsertProfile = @$"INSERT INTO authentication.profile (fullname, document, user_id)
            VALUES('{createCollaboratorRequest.Fullname}', '{createCollaboratorRequest.Document}', '{insertedUser.User_id}') RETURNING *;";
          var insertedProfile = connection.Query<Profile>(sqlInsertProfile).FirstOrDefault();

          string sqlInsertCollaborator = @$"INSERT INTO authentication.collaborator (user_id, sponsor_id, created_at, created_by)
            VALUES('{insertedUser.User_id}', '{createCollaboratorRequest.Sponsor_id}', CURRENT_TIMESTAMP, '{createCollaboratorRequest.Created_by}') RETURNING *;
          ";
          var responseCollaborator = connection.Query<Collaborator>(sqlInsertCollaborator).FirstOrDefault();

          _logger.Information("[CollaboratorRepository - CreateCollaborator]: Collaborator Created Successfully.");
          transaction.Commit();
          connection.Close();
          responseCollaborator.Role = role;
          responseCollaborator.Profile = insertedProfile;
          responseCollaborator.Email = insertedUser.Email;
          responseCollaborator.Fullname = insertedProfile.Fullname;
          return responseCollaborator;
        }
        catch (Exception ex)
        {
          _logger.Error(ex, "[CollaboratorRepository - CreateCollaborator]: Error While Create Collaborator.");
          transaction.Dispose();
          connection.Close();
          throw ex;
        }
      }
    }

    public bool DeleteCollaborator(List<Guid> ids)
    {
      try
      {
        using (var connection = new NpgsqlConnection(_connectionString))
        {
          foreach (var id in ids)
          {
            var collaborator = GetCollaboratorByCollaboratorId(id);
            string sql = $"DELETE FROM authentication.user WHERE user_id = '{collaborator.User_id}'";
            connection.Execute(sql);
          }
        }
        _logger.Information("[CollaboratorRepository - DeleteCollaborator]: Collaborators Deleted Successfully.");
        return true;
      }
      catch (Exception ex)
      {
        _logger.Error(ex, "[CollaboratorRepository - DeleteCollaborator]: Error While Delete Collaborators.");
        throw ex;
      }
    }

    public Collaborator GetCollaboratorByCollaboratorId(Guid collaborator_id)
    {
      try
      {
        using (var connection = new NpgsqlConnection(_connectionString))
        {
          string sql = @$"SELECT * FROM authentication.collaborator WHERE collaborator_id = '{collaborator_id}';";
          var response = connection.Query<Collaborator>(sql).FirstOrDefault();
          return response;
        }
      }
      catch (Exception ex)
      {
        _logger.Error(ex, "[CollaboratorRepository - GetCollaboratorByCollaboratorId]: Error while retrieve collaborator.");
        throw ex;
      }
    }

    public Collaborator GetCollaboratorByUserId(Guid user_id)
    {
      try
      {
        using (var connection = new NpgsqlConnection(_connectionString))
        {
          string sql = @$"SELECT * FROM authentication.collaborator WHERE user_id = '{user_id}';";
          var response = connection.Query<Collaborator>(sql).FirstOrDefault();
          return response;
        }
      }
      catch (Exception ex)
      {
        _logger.Error(ex, "[CollaboratorRepository - GetCollaboratorByCollaboratorId]: Error while retrieve collaborator.");
        throw ex;
      }
    }

    public ListCollaborators ListCollaboratorsBySponsorId(FilterCollaborator filter, Guid sponsor_id)
    {
      try
      {
        using (var connection = new NpgsqlConnection(_connectionString))
        {
          string sql = $@"
          with filter as (
            SELECT
              c.*
            , u.email
            , p.fullname
            , (SELECT row_to_json(profile) FROM (SELECT * FROM authentication.profile pf WHERE pf.user_id = c.user_id) profile ) as Profile
            FROM authentication.collaborator c
            INNER JOIN authentication.user u
            ON c.user_id = u.user_id
            INNER JOIN authentication.profile p
            ON p.user_id = c.user_id
            WHERE sponsor_id = '{sponsor_id}'
            )
          select * from filter where upper(fullname) like upper('%{filter.Filter}%')
          ";

          var response = connection.Query(sql).Select((x) => new Collaborator()
          {
            Profile = !string.IsNullOrEmpty(x.profile) ? JsonConvert.DeserializeObject<Profile>(x.profile) : new Profile(),
            Active = x.active,
            Collaborator_id = x.collaborator_id,
            Created_by = x.created_by,
            Email = x.email,
            Fullname = x.fullname,
            Sponsor_id = x.sponsor_id,
            Updated_by = x.updated_by,
            User_id = x.user_id
          }).ToList();

          int totalRows = response.Count();
          float totalPages = (float)Math.Ceiling((float)totalRows / (float)filter.ItensPerPage);

          _logger.Information("[CollaboratorRepository - ListCollaboratorsBySponsorId]: Collaborators Listed Successfully.");
          return new ListCollaborators()
          {
            Collaborators = response.Skip((int)((filter.Page - 1) * filter.ItensPerPage)).Take((int)filter.ItensPerPage).ToList(),
            Pagination = new Pagination()
            {
              totalPages = (int)totalPages,
              totalRows = totalRows
            }
          };
        }
      }
      catch (Exception ex)
      {
        _logger.Error(ex, "[CollaboratorRepository - ListCollaboratorsBySponsorId]: Error While List Collaborators.");
        throw ex;
      }
    }

    public bool UpdateCollaborator(List<UpdateCollaboratorRequest> updateCollaboratorRequestList)
    {
      try
      {
        using (var connection = new NpgsqlConnection(_connectionString))
        {
          foreach (var collaborator in updateCollaboratorRequestList)
          {
            string sql = @$"
              UPDATE authentication.collaborator
              SET active = {collaborator.Active}
              WHERE collaborator_id = '{collaborator.Collaborator_id}'
              RETURNING *;
            ";

            connection.Query<Collaborator>(sql).FirstOrDefault();
          }
          _logger.Information("[CollaboratorRepository - UpdateCollaborator]: Collaborator Updated Successfully.");
          return true;
        }
      }
      catch (Exception ex)
      {
        _logger.Error(ex, "[CollaboratorRepository - UpdateCollaborator]: Error While Update Collaborator.");
        throw ex;
      }
    }
  }
}
