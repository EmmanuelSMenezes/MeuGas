using System;
using System.Collections.Generic;
using System.Linq;
using Dapper;
using Domain.Model;
using Npgsql;
using Serilog;

namespace Infrastructure.Repository
{
  public class UserRepository : IUserRepository
  {
    private readonly string _connectionString;
    private readonly ILogger _logger;
    public UserRepository(string connectionString, ILogger logger)
    {
      _connectionString = connectionString;
      _logger = logger;
    }

    public User GetUserById(Guid user_id)
    {
      try
      {
        string sqlCredentials = @$"SELECT c.*, aa.admin_id FROM authentication.user c
                                  RIGHT JOIN authentication.role r ON r.role_id = c.role_id
                                  LEFT JOIN administrator.administrator aa ON aa.user_id = c.user_id
                                  WHERE c.user_id = '{user_id}';";
        using (var connection = new NpgsqlConnection(_connectionString))
        {
          var credentials = connection.Query<Credentials>(sqlCredentials).FirstOrDefault();
          if (credentials == null) return null;
          string sqlRole = @$"SELECT * FROM authentication.role WHERE role_id = '{credentials.Role_id}';";
          string sqlProfile = @$"SELECT * FROM authentication.profile WHERE user_id = '{credentials.User_id}';";
          var role = connection.Query<Role>(sqlRole).FirstOrDefault();
          var profile = connection.Query<Profile>(sqlProfile).FirstOrDefault();
          return new User()
          {
            Role = new Role()
            {
              Active = role.Active,
              Created_at = role.Created_at,
              Deleted_at = role.Deleted_at,
              Description = role.Description,
              Role_id = role.Role_id,
              Tag = role.Tag,
              Updated_at = role.Updated_at,
            },
            Profile = new Profile()
            {
              Active = profile.Active,
              Created_at = profile.Created_at,
              Deleted_at = profile.Deleted_at,
              Document = profile.Document,
              Fullname = profile.Fullname,
              Profile_id = profile.Profile_id,
              Updated_at = profile.Updated_at,
              Avatar = profile.Avatar,
              User_id = profile.User_id
            },
            Admin_id = credentials.Admin_id,
            Phone_verified = credentials.Phone_verified,
            Active = credentials.Active,
            Created_at = credentials.Created_at,
            User_id = credentials.User_id,
            Deleted_at = credentials.Deleted_at,
            Email = credentials.Email,
            Last_login = credentials.Last_login,
            Password = credentials.Password,
            Password_generated = credentials.Password_generated,
            Phone = credentials.Phone,
            Role_id = credentials.Role_id,
            Updated_at = credentials.Updated_at
          };
        }
      }
      catch (Exception ex)
      {
        throw ex;
      }
    }
    public User GetUserByEmail(String email, string role_name)
    {
      try
      {
        string sqlCredentials = @$"SELECT c.*, aa.admin_id FROM authentication.user c
                                  RIGHT JOIN authentication.role r ON r.tag = '{role_name}' AND r.role_id = c.role_id
                                  LEFT JOIN administrator.administrator aa ON aa.user_id = c.user_id
                                  WHERE c.email = '{email}';";
        using (var connection = new NpgsqlConnection(_connectionString))
        {
          var credentials = connection.Query<Credentials>(sqlCredentials).FirstOrDefault();
          if (credentials == null) return null;
          string sqlRole = @$"SELECT * FROM authentication.role WHERE role_id = '{credentials.Role_id}';";
          string sqlProfile = @$"SELECT * FROM authentication.profile WHERE user_id = '{credentials.User_id}';";
          var role = connection.Query<Role>(sqlRole).FirstOrDefault();
          var profile = connection.Query<Profile>(sqlProfile).FirstOrDefault();
          return new User()
          {
            Role = new Role()
            {
              Active = role.Active,
              Created_at = role.Created_at,
              Deleted_at = role.Deleted_at,
              Description = role.Description,
              Role_id = role.Role_id,
              Tag = role.Tag,
              Updated_at = role.Updated_at,
            },
            Profile = new Profile()
            {
              Active = profile.Active,
              Created_at = profile.Created_at,
              Deleted_at = profile.Deleted_at,
              Document = profile.Document,
              Fullname = profile.Fullname,
              Profile_id = profile.Profile_id,
              Updated_at = profile.Updated_at,
              Avatar = profile.Avatar,
              User_id = profile.User_id
            },
            Active = credentials.Active,
            Created_at = credentials.Created_at,
            User_id = credentials.User_id,
            Deleted_at = credentials.Deleted_at,
            Email = credentials.Email,
            Last_login = credentials.Last_login,
            Admin_id = credentials.Admin_id,
            Password = credentials.Password,
            Password_generated = credentials.Password_generated,
            Phone_verified = credentials.Phone_verified,
            Phone = credentials.Phone,
            Role_id = credentials.Role_id,
            Updated_at = credentials.Updated_at
          };
        }
      }
      catch (Exception ex)
      {
        throw ex;
      }
    }

    public User GetUserByPhone(String phone, string role_name)
    {
      try
      {
        string sqlCredentials = @$"SELECT c.*, aa.admin_id FROM authentication.user c
                                  RIGHT JOIN authentication.role r ON r.tag = '{role_name}' AND r.role_id = c.role_id
                                  LEFT JOIN administrator.administrator aa ON aa.user_id = c.user_id
                                  WHERE c.phone = '{phone}';";
        using (var connection = new NpgsqlConnection(_connectionString))
        {
          var credentials = connection.Query<Credentials>(sqlCredentials).FirstOrDefault();
          if (credentials == null) return null;
          string sqlRole = @$"SELECT * FROM authentication.role WHERE role_id = '{credentials.Role_id}';";
          string sqlProfile = @$"SELECT * FROM authentication.profile WHERE user_id = '{credentials.User_id}';";
          var role = connection.Query<Role>(sqlRole).FirstOrDefault();
          var profile = connection.Query<Profile>(sqlProfile).FirstOrDefault();
          return new User()
          {
            Role = new Role()
            {
              Active = role.Active,
              Created_at = role.Created_at,
              Deleted_at = role.Deleted_at,
              Description = role.Description,
              Role_id = role.Role_id,
              Tag = role.Tag,
              Updated_at = role.Updated_at,
            },
            Profile = new Profile()
            {
              Active = profile.Active,
              Created_at = profile.Created_at,
              Deleted_at = profile.Deleted_at,
              Document = profile.Document,
              Fullname = profile.Fullname,
              Profile_id = profile.Profile_id,
              Updated_at = profile.Updated_at,
              Avatar = profile.Avatar,
              User_id = profile.User_id
            },
            Admin_id = credentials.Admin_id,
            Active = credentials.Active,
            Created_at = credentials.Created_at,
            User_id = credentials.User_id,
            Deleted_at = credentials.Deleted_at,
            Email = credentials.Email,
            Last_login = credentials.Last_login,
            Password = credentials.Password,
            Phone_verified = credentials.Phone_verified,
            Password_generated = credentials.Password_generated,
            Phone = credentials.Phone,
            Role_id = credentials.Role_id,
            Updated_at = credentials.Updated_at
          };
        }
      }
      catch (Exception ex)
      {
        throw ex;
      }
    }

    public CreateUserResponse CreateUser(CreateUserRequest createUserRequest)
    {
      try
      {
        var sqlGetRole = @$"SELECT * FROM authentication.role WHERE tag = '{createUserRequest.RoleName.ToString()}';";
        using (var connection = new NpgsqlConnection(_connectionString))
        {
          var role = connection.Query<Role>(sqlGetRole).FirstOrDefault();


          var sqlInsertUser = $@"INSERT INTO authentication.user (email, phone, password, role_id, active, password_generated)
                              VALUES('{createUserRequest.Email}', '{createUserRequest.Phone}',  '{createUserRequest.Password}', '{role.Role_id}', true, {createUserRequest.generatedPassword}) RETURNING *;";

          connection.Open();

          var transaction = connection.BeginTransaction();

          var insertedUser = connection.Query<Credentials>(sqlInsertUser).FirstOrDefault();

          var sqlInsertProfile = @$"INSERT INTO authentication.profile (fullname, document, user_id)
                                  VALUES('{createUserRequest.Fullname}', '{createUserRequest.Document}', '{insertedUser.User_id}') RETURNING *;";
          var insertedProfile = connection.Query<Profile>(sqlInsertProfile).FirstOrDefault();
          var insertedAdmin = new Administrator();
          if (UserRole.ADM == createUserRequest.RoleName)
          {
            var sqlInsertAdmin = $@"INSERT INTO administrator.administrator (user_id) VALUES('{insertedUser.User_id}') RETURNING *;";
            insertedAdmin = connection.Query(sqlInsertAdmin).FirstOrDefault();
          }



          if (insertedUser == null || insertedProfile == null)
          {
            transaction.Dispose();
            connection.Close();
            throw new Exception("errorWhileInsertUserOnDB");
          }

          transaction.Commit();
          connection.Close();

          return new CreateUserResponse()
          {
            Role = role,
            Role_id = role.Role_id,
            Profile = insertedProfile,
            User_id = insertedUser.User_id,
            Active = insertedUser.Active,
            Created_at = insertedUser.Created_at,
            Deleted_at = insertedUser.Deleted_at,
            Email = insertedUser.Email,
            Last_login = insertedUser.Last_login,
            Password_generated = insertedUser.Password_generated,
            Phone_verified = insertedUser.Phone_verified,
            Admin_id = insertedAdmin.Admin_id,
            Phone = insertedUser.Phone,
            Updated_at = insertedUser.Updated_at
          };

        }
      }
      catch (Exception ex)
      {
        throw ex;
      }
    }

    public bool ResetPassword(RequestResetPassword requestResetPassword)
    {
      try
      {
        var sql = $@"UPDATE authentication.user
                    SET password = '{requestResetPassword.HashedPassword}', password_generated=false, updated_at=CURRENT_TIMESTAMP
                    WHERE user_id='{requestResetPassword.User_id}'
                    and role_id='{requestResetPassword.Role_id}'
                    and email = '{requestResetPassword.Email}';";

        using (var connection = new NpgsqlConnection(_connectionString))
        {
          var response = connection.Execute(sql);
          if (response > 0)
          {
            return true;
          }
          return false;
        }
      }
      catch (Exception ex)
      {
        _logger.Error(ex, "[UserRepository - ResetPassword]: Erro while update user password");
        throw ex;
      }
    }

    public bool ChangePassword(RequestChangePassword requestChangePassword)
    {
      try
      {
        var sql = $@"UPDATE authentication.user
                    SET password = '{requestChangePassword.HashedPassword}', password_generated=false, updated_at=CURRENT_TIMESTAMP
                    WHERE user_id='{requestChangePassword.User_id}'
                    and role_id='{requestChangePassword.Role_id}'
                    and email = '{requestChangePassword.Email}';";

        using (var connection = new NpgsqlConnection(_connectionString))
        {
          var response = connection.Execute(sql);
          if (response > 0)
          {
            return true;
          }
          return false;
        }
      }
      catch (Exception ex)
      {
        _logger.Error(ex, "[UserRepository - ResetPassword]: Erro while update user password");
        throw ex;
      }
    }

    public UpdateUserResponse UpdateUser(User user)
    {
      try
      {
        using (var connection = new NpgsqlConnection(_connectionString))
        {
          connection.Open();
          NpgsqlTransaction transaction = connection.BeginTransaction();
          string sqlUpdateUser = @$"UPDATE authentication.user
                        SET email='{user.Email}'
                        , phone='{user.Phone}'
                        , active='{user.Active}'
                        , phone_verified='{user.Phone_verified}'
                        , updated_at=CURRENT_TIMESTAMP
                        WHERE user_id='{user.User_id}'
                        RETURNING *;";

          string sqlUpdateProfile = @$"UPDATE authentication.profile
                        SET fullname='{user.Profile.Fullname}'
                        , avatar='{user.Profile.Avatar}'
                        , document='{user.Profile.Document}'
                        , active='{user.Active}'
                        , updated_at=CURRENT_TIMESTAMP
                        WHERE profile_id='{user.Profile.Profile_id}' and user_id = '{user.User_id}'
                        RETURNING *;";
          var userUpdated = connection.Query<Credentials>(sqlUpdateUser).FirstOrDefault();
          var profileUpdated = connection.Query<Profile>(sqlUpdateProfile).FirstOrDefault();

          transaction.Commit();
          connection.Close();
          _logger.Information("[UserRepository - UpdateUser]: User updated succesfully.");
          return new UpdateUserResponse()
          {
            Role = user.Role,
            Role_id = user.Role_id,
            Profile = profileUpdated,
            User_id = userUpdated.User_id,
            Active = userUpdated.Active,
            Created_at = userUpdated.Created_at,
            Deleted_at = userUpdated.Deleted_at,
            Email = userUpdated.Email,
            Last_login = userUpdated.Last_login,
            Password_generated = userUpdated.Password_generated,
            Phone = userUpdated.Phone,
            Phone_verified = userUpdated.Phone_verified,
            Updated_at = userUpdated.Updated_at
          };
        }
      }
      catch (Exception ex)
      {
        _logger.Error(ex, "[UserRepository - UpdateUser]: Error while updating user.");
        throw ex;
      }
    }

    public bool DeleteUser(List<Guid> ids)
    {

      using (var connection = new NpgsqlConnection(_connectionString))
      {
        connection.Open();
        var transaction = connection.BeginTransaction();
        try
        {
          foreach (var user_id in ids)
          {
            User user = GetUserById(user_id);
            if (user == null)
            {
              throw new Exception("userNotExists");
            }

            // Excluindo Todos os Colaboradores
            string deleteColaboratorsUser = $@"
                    delete from authentication.user u
                    where u.user_id in (
                        select user_id
                        from authentication.collaborator c
                        where c.sponsor_id = '{user.User_id}'
                    )
                ";
            var excludedCollaboratorCount = connection.Execute(deleteColaboratorsUser);
            if (excludedCollaboratorCount < 0)
            {
              transaction.Dispose();
              connection.Close();
              throw new Exception("errorWhileDeleteUserOnDB");
            }

            var sqlDeleteUser = @$"DELETE FROM authentication.user WHERE user_id='{user.User_id}';";
            connection.Execute(sqlDeleteUser);

            

            // Finalizando Chats dos Parceiros e Todos os Colaboradores
            string finalizeChatsOfPartnerSql = $@"
                    UPDATE communication.chat c SET description='Usuário Excluído - {user.Profile.Fullname}', updated_at=CURRENT_TIMESTAMP, closed=CURRENT_TIMESTAMP, closed_by='{user.User_id}'
                    FROM communication.chat_member cm
                    WHERE cm.user_id = '{user.User_id}' AND c.chat_id = cm.chat_id
                ";
            var finalizeChatsOfPartnerCount = connection.Execute(finalizeChatsOfPartnerSql);
            if (finalizeChatsOfPartnerCount < 0)
            {
              transaction.Dispose();
              connection.Close();
              throw new Exception("errorWhileDeleteUserOnDB");
            }
          }

          transaction.Commit();
          connection.Close();
          _logger.Information("[UserRepository - DeleteUser] - User Deleted.");
          return true;
        }
        catch (Exception ex)
        {
          transaction.Dispose();
          connection.Close();
          _logger.Error(ex, "[UserRepository - DeleteUser] - Error While Delete User.");
          throw ex;
        }
      }
    }
  }
}
