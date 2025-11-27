using System;
using System.Collections.Generic;
using System.Linq;
using Dapper;
using Domain.Model;
using Microsoft.CodeAnalysis.Operations;
using Microsoft.VisualBasic;
using Npgsql;
using Serilog;

namespace Infrastructure.Repository
{
    public class ReputationProductRepository : IReputationProductRepository
    {
        private readonly string _connectionString;
        private readonly ILogger _logger;
        public ReputationProductRepository(string connectionString, ILogger logger)
        {
            _connectionString = connectionString;
            _logger = logger;
        }

        public RatingResponse CreateRating(CreateRatingRequest createRatingRequest)
        {
            try
            {
               

                using (var connection = new NpgsqlConnection(_connectionString))
                {

                    connection.Open();
                    var transaction = connection.BeginTransaction();

                    var sqlinsertrating = @$"INSERT INTO reputation.rating( user_id, rating_value, note, created_by)
                          VALUES('{createRatingRequest.Created_by}', 
                          '{createRatingRequest.Rating_value}', '{createRatingRequest.Note}', '{createRatingRequest.Created_by}') RETURNING *";

                    var response = connection.Query<RatingResponse>(sqlinsertrating).FirstOrDefault();

                 

                    var sqlinsertratingpartner = @$"INSERT INTO reputation.branch_rating(rating_id, branch_id, created_by)
                          VALUES('{response.Rating_id}', '{createRatingRequest.Branch_id}', '{createRatingRequest.Created_by}') RETURNING *";

                    var insertrating = connection.Query<RatingResponse>(sqlinsertratingpartner).FirstOrDefault();

                    if (response == null || insertrating == null)
                    {
                        transaction.Dispose();
                        connection.Close();
                        throw new Exception("errorWhileInsertRatingOnDB");
                    }
                    response.Branch_id = insertrating.Branch_id;
                    transaction.Commit();
                    connection.Close();
                    return response;
                }
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public List<RatingResponse> GetRating(Guid branch_id)
        {
            try
            {
                var sql = @$"SELECT r.*, br.branch_id  FROM reputation.rating r
                             INNER JOIN reputation.branch_rating br 
                             ON r.rating_id = br.rating_id
                             WHERE br.branch_id  = '{branch_id}' ";



                using (var connection = new NpgsqlConnection(_connectionString))
                {
                    var response = connection.Query<RatingResponse>(sql).ToList();

                    if (response == null) throw new Exception("");

                    return response;
                }
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public RatingResponse GetRatingBranchByConsumerId(Guid branch_id, Guid consumer_id)
        {

            try
            {
                var sql = @$"SELECT r.*, br.branch_id  FROM reputation.rating r
                             INNER JOIN reputation.branch_rating br 
                             ON r.rating_id = br.rating_id
                             WHERE br.branch_id  = '{branch_id}' and r.user_id = '{consumer_id}'";



                using (var connection = new NpgsqlConnection(_connectionString))
                {
                    var response = new RatingResponse();
                        response = connection.Query<RatingResponse>(sql).FirstOrDefault();

                    return response;
                }
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
    }
}
