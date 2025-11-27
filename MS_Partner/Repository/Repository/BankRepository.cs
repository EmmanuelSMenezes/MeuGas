using Dapper;
using Domain.Model;
using Domain.Model.Request;
using Domain.Model.Response;
using Newtonsoft.Json;
using Npgsql;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Infrastructure.Repository
{
    public class BankRepository : IBankRepository
    {
        private readonly string _connectionString;
        private readonly ILogger _logger;

        public BankRepository(string connectionString, ILogger logger)
        {
            _connectionString = connectionString;
            _logger = logger;
        }

        public BankPartner CreateBank(CreateBankRequest bankRequest)
        {
            try
            {
                using (var connection = new NpgsqlConnection(_connectionString))
                {
                    var sql = @$"INSERT INTO partner.bank_details
                                    (partner_id, bank, agency, account_number, created_by, account_id)
                                 VALUES('{bankRequest.Partner_id}', '{bankRequest.Bank}', '{bankRequest.Agency}', 
                                '{bankRequest.Account_number}', '{bankRequest.Created_by}', '{bankRequest.Account_id}') RETURNING *";

                    var response = connection.Query<BankPartner>(sql).First();

                    return response;
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "[Repository - CreateBank]: Exception when creating bank details!");
                throw;
            }
        }

        public BankPartner DeleteBank(Guid bank_details_id)
        {
            try
            {
                using (var connection = new NpgsqlConnection(_connectionString))
                {
                    var sql = @$"DELETE FROM partner.bank_details WHERE bank_details_id = '{bank_details_id}' RETURNING *;";

                    var response = connection.Query<BankPartner>(sql).First();

                    return response;
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "[Repository - DeleteBank]: Exception when fetching bank details!");
                throw;
            }
        }

        public BankPartner GetBankById(Guid partner_id)
        {
            try
            {
                using (var connection = new NpgsqlConnection(_connectionString))
                {
                    var sql = @$"SELECT * FROM partner.bank_details WHERE partner_id = '{partner_id}';";

                    var response = connection.Query<BankPartner>(sql);

                    if (response == null) return new BankPartner();

                    return response.FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "[Repository - GetBankById]: Exception when fetching bank details!");
                throw;
            }
        }

        public BankPartner UpdateBank(UpdateBankRequest bankRequest)
        {
            try
            {
                using (var connection = new NpgsqlConnection(_connectionString))
                {
                    var sql = @$"UPDATE partner.bank_details
                                 SET bank='{bankRequest.Bank}', 
                                     agency='{bankRequest.Agency}', 
                                     account_number='{bankRequest.Account_number}', 
                                     account_id='{bankRequest.Account_id}', 
                                     active={bankRequest.Active},
                                     updated_by='{bankRequest.Updated_by}', 
                                     updated_at=CURRENT_TIMESTAMP
                                 WHERE bank_details_id='{bankRequest.Bank_details_id}' RETURNING *";

                    var response = connection.Query<BankPartner>(sql).First();

                    return response;
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "[Repository - UpdateBank]: Exception when updating bank details!");
                throw;
            }
        }
    }
}
