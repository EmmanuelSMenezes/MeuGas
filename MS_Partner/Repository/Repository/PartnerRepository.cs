using Dapper;
using Domain.Model;
using Domain.Model.Request;
using Domain.Model.Response;
using Infrastructure.Repository;
using Newtonsoft.Json;
using Npgsql;
using Serilog;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;

namespace Infrastructure.Repository
{
    public class PartnerRepository : IPartnerRepository
    {
        private readonly string _connectionString;
        private readonly ILogger _logger;

        public PartnerRepository(string connectionString, ILogger logger)
        {
            _connectionString = connectionString;
            _logger = logger;
        }

        public Partner Create(CreatePartnerRequest partner)
        {
            try
            {
                using (var connection = new NpgsqlConnection(_connectionString))
                {
                    // INSERINDO NOVO PARCEIRO
                    string sqlInsertPartner = $@"INSERT INTO partner.partner
                                (
                                    legal_name, fantasy_name, document, 
                                    email, phone_number, user_id, admin_id, created_by, service_fee, card_fee
                                )
                                VALUES
                                (
                                     '{partner.Legal_name}'
                                    ,'{partner.Fantasy_name}'
                                    ,'{partner.Document}'
                                    ,'{partner.Email}'
                                    ,'{partner.Phone_number}'
                                    ,'{partner.User_id}'
                                    ,'{partner.Admin_id}'
                                    ,'{partner.Created_by}'
                                    ,'{partner.Service_fee.ToString().Replace(",", ".")}'
                                    ,'{partner.Card_fee.ToString().Replace(",",".")}'
                                ) RETURNING *;";

                    connection.Open();

                    var transaction = connection.BeginTransaction();

                    var insertedPartner = connection.Query<Partner>(sqlInsertPartner).FirstOrDefault();

                    // CADASTRANDO UNIDADE/FILIAL DO PARCEIRO
                    string sqlInsertBranch = $@"INSERT INTO partner.branch
                                                (
                                                    branch_name, document, partner_id, phone, created_by
                                                )
                                                VALUES
                                                (
                                                     '{partner.Branch.First().Branch_name}'
                                                   , '{partner.Branch.First().Document}'
                                                   , '{insertedPartner.Partner_id}'
                                                   , '{partner.Branch.First().Phone}'
                                                   , '{partner.Created_by}'
                                                ) RETURNING *; ";

                    var insertedBranch = connection.Query<Branch>(sqlInsertBranch).ToList();

                    // CADASTRANDO ENDEREÇO DO PARCEIRO
                    string sqlInsertAdress = $@"INSERT INTO partner.address
                                                (
                                                  street, number, complement, district, city, state, zip_code, latitude, longitude, branch_id, created_by
                                                )
                                                VALUES
                                                (
                                                    '{partner.Branch.FirstOrDefault().Address.Street}'
                                                   ,'{partner.Branch.FirstOrDefault().Address.Number}'
                                                   ,'{partner.Branch.FirstOrDefault().Address.Complement}'
                                                   ,'{partner.Branch.FirstOrDefault().Address.District}'
                                                   ,'{partner.Branch.FirstOrDefault().Address.City}'
                                                   ,'{partner.Branch.FirstOrDefault().Address.State}'
                                                   ,'{partner.Branch.FirstOrDefault().Address.Zip_code}'
                                                   ,'{partner.Branch.FirstOrDefault().Address.Latitude}'
                                                   ,'{partner.Branch.FirstOrDefault().Address.Longitude}'
                                                   ,'{insertedBranch.First().Branch_id}'
                                                   ,'{partner.Created_by}'
                                                ) RETURNING *;";

                    var insertedAddress = connection.Query<Address>(sqlInsertAdress).FirstOrDefault();

                    insertedBranch.FirstOrDefault().Address = insertedAddress;
                    insertedPartner.Branch = insertedBranch;


                    var sql = @$"INSERT INTO billing.pagseguro_value_minimum
                            (partner_id, created_by)
                            VALUES('{insertedPartner.Partner_id}',
                                   '{partner.Created_by}') RETURNING *";

                    var valueminumum = connection.Query<dynamic>(sql).FirstOrDefault();

                    if (valueminumum == null || insertedPartner == null || insertedBranch == null || insertedAddress == null)
                    {
                        transaction.Dispose();
                        connection.Close();
                        throw new Exception("errorWhileInsertPartnerOnDB");
                    }

                    transaction.Commit();
                    connection.Close();

                    return insertedPartner;
                }
            }
            catch (Exception)
            {
                throw new Exception("errorWhileInsertPartnerOnDB");
            }
        }

        public bool Delete(List<Guid> id)
        {
            try
            {
                using (var connection = new NpgsqlConnection(_connectionString))
                {
                    connection.Open();
                    var transaction = connection.BeginTransaction();

                    foreach (var item in id)
                    {
                        // Verificar se existe o Partner_id no banco de dados
                        string queryPartnerId = $@"SELECT * FROM partner.partner WHERE partner_id = '{item}'";
                        var partnerId = connection.Query<Partner>(queryPartnerId).FirstOrDefault();

                        if (partnerId != null)
                        {
                            // Listar todas as unidades/filiais vinculados ao parceiro
                            string queryBranchId = $@"SELECT * FROM partner.branch WHERE partner_id = '{partnerId.Partner_id}'";
                            var branchs = connection.Query<Branch>(queryBranchId).ToList();

                            foreach (var branchId in branchs)
                            {
                                string queryAddressId = $@"SELECT * FROM partner.address WHERE branch_id = '{branchId.Branch_id}'";
                                var addressId = connection.Query<Address>(queryAddressId).FirstOrDefault();

                                // EXCLUINDO ENDEREÇO DO PARCEIRO
                                string sqlDeleteAddress = $@"DELETE FROM partner.address WHERE address_id = '{addressId.Address_id}' RETURNING *;";
                                connection.Execute(sqlDeleteAddress);

                                // EXCLUINDO UNIDADE/FILIAL
                                string sqlDeleteBranch = $@"DELETE FROM partner.branch WHERE branch_id = '{branchId.Branch_id}' RETURNING *;";
                                connection.Execute(sqlDeleteBranch);
                            }

                            // EXCLUINDO PARCEIRO
                            string sqlDeletePartner = $@"DELETE FROM partner.partner WHERE partner_id = '{partnerId.Partner_id}' RETURNING *;";
                            var deletedPartner = connection.Query<Partner>(sqlDeletePartner).FirstOrDefault();

                            if (deletedPartner == null)
                            {
                                transaction.Dispose();
                                connection.Close();
                                throw new Exception("errorWhileDeletePartnerOnDB");
                            }
                        }
                        else
                        {
                            return false;
                        }

                    }

                    transaction.Commit();
                    connection.Close();
                    return true;
                }
            }
            catch (Exception)
            {
                throw new Exception("errorWhileDeletePartnerOnDB");
            }
        }

        public Partner Update(UpdatePartnerRequest partner)
        {
            try
            {
                string sql = @$"UPDATE partner.partner SET 
                                       legal_name = '{partner.Legal_name}'
                                     , fantasy_name = '{partner.Fantasy_name}'
                                     , document = '{partner.Document}'
                                     , email = '{partner.Email}'
                                     , phone_number = '{partner.Phone_number}'
                                     , active = {partner.Active}
                                     , admin_id = '{partner.Admin_id}'
                                     , service_fee = {partner.Service_fee.ToString().Replace(",",".")}
                                     , card_fee = {partner.Card_fee.ToString().Replace(",",".")}
                                     , updated_at = NOW()
                                     , updated_by = '{partner.User_id}'
                                WHERE partner_id = '{partner.Partner_id}' RETURNING *;";

                using (var connection = new NpgsqlConnection(_connectionString))
                {
                    connection.Open();

                    var transaction = connection.BeginTransaction();

                    var updatePartner = connection.Query<Partner>(sql).FirstOrDefault();

                    string sqlupdateBranch = $@"UPDATE partner.branch SET
                                                
                                                    branch_name = '{partner.Branch.First().Branch_name}', 
                                                    document = '{partner.Branch.First().Document}', 
                                                    partner_id = '{updatePartner.Partner_id}', 
                                                    phone = '{partner.Branch.First().Phone}', 
                                                    updated_by = '{partner.updated_by}',
                                                    updated_at = CURRENT_TIMESTAMP,
                                                    active = {partner.Active}
                                                    WHERE branch_id = '{partner.Branch.First().Branch_id}' RETURNING *; ";

                    var updateBranch = connection.Query<Branch>(sqlupdateBranch).ToList();

                    string sqlupdateAdress = $@"UPDATE partner.address SET
                                               
                                                    street = '{partner.Branch.FirstOrDefault().Address.Street}', 
                                                    number = '{partner.Branch.FirstOrDefault().Address.Number}', 
                                                    complement = '{partner.Branch.FirstOrDefault().Address.Complement}', 
                                                    district = '{partner.Branch.FirstOrDefault().Address.District}', 
                                                    city = '{partner.Branch.FirstOrDefault().Address.City}', 
                                                    state = '{partner.Branch.FirstOrDefault().Address.State}', 
                                                    zip_code = '{partner.Branch.FirstOrDefault().Address.Zip_code}', 
                                                    latitude = '{partner.Branch.FirstOrDefault().Address.Latitude}', 
                                                    longitude = '{partner.Branch.FirstOrDefault().Address.Longitude}', 
                                                    branch_id = '{partner.Branch.First().Branch_id}', 
                                                    updated_by = '{partner.updated_by}',
                                                    updated_at = CURRENT_TIMESTAMP,
                                                    active = {partner.Branch.First().Address.Active}
                                                    WHERE address_id = '{partner.Branch.First().Address.Address_id}' RETURNING *;";


                    var updatedAddress = connection.Query<Address>(sqlupdateAdress).FirstOrDefault();

                    updateBranch.FirstOrDefault().Address = updatedAddress;
                    updatePartner.Branch = updateBranch;

                    if (updatePartner is null || updateBranch.Count() != partner.Branch.Count || updatedAddress is null)
                    {
                        transaction.Dispose();
                        connection.Close();
                        throw new Exception("errorWhileInsertPartnerOnDB");
                    }

                    transaction.Commit();
                    connection.Close();

                    return updatePartner;
                }
            }
            catch (Exception)
            {
                throw new Exception("errorWhileDeletePartnerOnDB");
            }
        }

        public bool MassInactive(List<Guid> id)
        {
            try
            {
                using (var connection = new NpgsqlConnection(_connectionString))
                {
                    foreach (var item in id)
                    {
                        string sql = @$"UPDATE partner.partner SET active=false, updated_at=NOW()
                                WHERE partner_id='{item}' RETURNING *;";

                        var returnedPartner = connection.Query<Partner>(sql).ToList();
                        if (!returnedPartner.Any())
                        {
                            return false;
                        }
                    }
                    return true;
                }
            }
            catch (Exception)
            {
                throw new Exception("errorWhileInactivePartnerOnDB");
            }
        }

        public ListPartnerResponse GetPartners(Filter filter)
        {
            try
            {
                using (var connection = new NpgsqlConnection(_connectionString))
                {
                    var sql = $@" SELECT 
                                  p.*,
                                  ap.avatar,
                                  ( 
                                    SELECT json_agg(branch)
                                    FROM (
                                      SELECT b.*,
                                      coalesce((SUM(r.rating_value)/COUNT(DISTINCT(br.rating_id))),0) ratings,
                                      to_jsonb(a.*) address
                                      FROM partner.branch b
                                      inner join partner.address a on a.branch_id = b.branch_id
                                      left join reputation.branch_rating br on b.branch_id = br.branch_id
                                      left join reputation.rating r on br.rating_id = r.rating_id 
                                      WHERE p.partner_id = b.partner_id  group by b.branch_id,a.*
                                    ) branch
                                  ) AS branch
                                FROM partner.partner p
                                inner join authentication.profile ap
                                on p.user_id  = ap.user_id Where (upper(p.legal_name) like upper('%{filter.filter}%') or upper(p.fantasy_name) like upper('%{filter.filter}%') or p.document like '%{filter.filter}%' or CAST(p.identifier as TEXT) LIKE '%{filter.filter}%');";

                    var response = connection.Query(sql).Select(x => new Partner()
                    {
                        Partner_id = x.partner_id,
                        Identifier = x.identifier,
                        Legal_name = x.legal_name,
                        Fantasy_name = x.fantasy_name,
                        Avatar = x.avatar,
                        Document = x.document,
                        Email = x.email,
                        Phone_number = x.phone_number,
                        Branch = (!string.IsNullOrEmpty(x.branch) ? JsonConvert.DeserializeObject<List<Branch>>(x.branch) : new List<Branch>()),
                        User_id = x.user_id,
                        Admin_id = x.admin_id,
                        Active = x.active,
                        Service_fee = x.service_fee,
                        Card_fee = x.card_fee,
                        Created_by = x.created_by,
                        Updated_by = x.updated_by
                    }
                     ).ToList();

                    if (response.Count > 0)
                    {
                        int totalRows = response.Count();
                        float totalPages = (float)totalRows / (float)filter.itensPerPage;

                        totalPages = (float)Math.Ceiling(totalPages);

                        response = response.Skip((int)((filter.page - 1) * filter.itensPerPage)).Take((int)filter.itensPerPage).ToList();

                        return new ListPartnerResponse()
                        {
                            Partners = response,
                            Pagination = new Pagination()
                            {
                                totalPages = (int)totalPages,
                                totalRows = totalRows
                            }
                        };
                    }
                    return new ListPartnerResponse();
                }


            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public Partner GetPartnerById(Guid partner_id)
        {
            try
            {
                string sql = $@"SELECT 
                                  p.*,
                                  ap.avatar,
                                  ( 
                                    SELECT json_agg(branch)
                                    FROM (
                                      SELECT b.*,
                                      coalesce((SUM(r.rating_value)/COUNT(DISTINCT(br.rating_id))),0) ratings,
                                      to_jsonb(a.*) address
                                      FROM partner.branch b
                                      inner join partner.address a on a.branch_id = b.branch_id
                                      left join reputation.branch_rating br on b.branch_id = br.branch_id
                                      left join reputation.rating r on br.rating_id = r.rating_id 
                                      WHERE p.partner_id = b.partner_id  group by b.branch_id,a.*
                                    ) branch
                                  ) AS branch
                                FROM partner.partner p
                                inner join authentication.profile ap
                                on p.user_id  = ap.user_id
                                WHERE p.partner_id = '{partner_id}';";

                using (var connection = new NpgsqlConnection(_connectionString))
                {
                    var response = connection.Query(sql).Select(x => new Partner()
                    {
                        Partner_id = x.partner_id,
                        Identifier = x.identifier,
                        Legal_name = x.legal_name,
                        Fantasy_name = x.fantasy_name,
                        Avatar = x.avatar,
                        Document = x.document,
                        Email = x.email,
                        Phone_number = x.phone_number,
                        Branch = (!string.IsNullOrEmpty(x.branch) ? JsonConvert.DeserializeObject<List<Branch>>(x.branch) : new List<Branch>()),
                        User_id = x.user_id,
                        Admin_id = x.admin_id,
                        Active = x.active,
                        Service_fee = x.service_fee,
                        Card_fee = x.card_fee,
                        Created_by = x.created_by,
                        Updated_by = x.updated_by
                    }
                     ).ToList();

                    if (response == null)
                    {
                        throw new Exception("partnerNotCreated");
                    }
                    return response.FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception while retrieving data in GetUserById!");
                throw ex;
            }
        }
        public Partner GetPartnerByUserId(Guid user_id)
        {
            try
            {
                string sql = $@"SELECT *, profile.avatar FROM partner.partner
                                inner join authentication.profile
                                on partner.partner.user_id  = authentication.profile.user_id WHERE partner.partner.user_id = '{user_id}';";

                using (var connection = new NpgsqlConnection(_connectionString))
                {
                    var response = connection.Query<Partner>(sql).FirstOrDefault();
                    if (response == null)
                    {
                        throw new Exception("partnerNotCreated");
                    }
                    return response;
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception while retrieving data in GetUserById!");
                throw ex;
            }
            return new Partner();
        }
        public Partner GetPartnerByAdminId(Guid admin_id, Filter filter)
        {
            try
            {
                string sql = $@"SELECT 
                                  p.*,
                                  ap.avatar,
                                  ( 
                                    SELECT json_agg(branch)
                                    FROM (
                                      SELECT b.*,
                                      coalesce((SUM(r.rating_value)/COUNT(DISTINCT(br.rating_id))),0) ratings,
                                      to_jsonb(a.*) address
                                      FROM partner.branch b
                                      inner join partner.address a on a.branch_id = b.branch_id
                                      left join reputation.branch_rating br on b.branch_id = br.branch_id
                                      left join reputation.rating r on br.rating_id = r.rating_id 
                                      WHERE p.partner_id = b.partner_id  group by b.branch_id,a.*
                                    ) branch
                                  ) AS branch
                                FROM partner.partner p
                                inner join authentication.profile ap
                                on p.user_id  = ap.user_id
                                WHERE p.admin_id = '{admin_id}' 
                                and (upper(p.legal_name) like upper('%{filter.filter}%') or upper(p.fantasy_name) like upper('%{filter.filter}%') or p.document like '%{filter.filter}%' or CAST(p.identifier as TEXT) LIKE '%{filter.filter}%');";

                using (var connection = new NpgsqlConnection(_connectionString))
                {
                    var response = connection.Query(sql).Select(x => new Partner()
                    {
                        Partner_id = x.partner_id,
                        Identifier = x.identifier,
                        Legal_name = x.legal_name,
                        Fantasy_name = x.fantasy_name,
                        Avatar = x.avatar,
                        Document = x.document,
                        Email = x.email,
                        Phone_number = x.phone_number,
                        Branch = (!string.IsNullOrEmpty(x.branch) ? JsonConvert.DeserializeObject<List<Branch>>(x.branch) : new List<Branch>()),
                        User_id = x.user_id,
                        Admin_id = x.admin_id,
                        Active = x.active,
                        Service_fee = x.service_fee,
                        Card_fee = x.card_fee,
                        Created_by = x.created_by,
                        Updated_by = x.updated_by
                    }
                     ).ToList();

                    if (response == null)
                    {
                        throw new Exception("partnerNotCreated");
                    }
                    return response.FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception while retrieving data in GetUserById!");
                throw ex;
            }
        }
        public bool GetPartnerByEmail(string email)
        {
            try
            {
                string sql = $@"SELECT *, profile.avatar FROM partner.partner
                                inner join authentication.profile
                                on partner.partner.user_id  = authentication.profile.user_id WHERE email = '{email}';";

                using (var connection = new NpgsqlConnection(_connectionString))
                {
                    var response = connection.Query<Partner>(sql).ToList();
                    if (response.Count() > 0) return true;
                    return false;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public bool GetPartnerByDocument(string document)
        {
            try
            {
                string sql = $@"SELECT * FROM partner.partner WHERE document = '{document}';";

                using (var connection = new NpgsqlConnection(_connectionString))
                {
                    var response = connection.Query<Partner>(sql).ToList();
                    if (response.Count() > 0) return true;
                    return false;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public RateSettings GetRateSettings(Guid admin_id)
        {
            try
            {
                using (var connection = new NpgsqlConnection(_connectionString))
                {
                    var sql = @$"SELECT * FROM administrator.interest_rate_setting WHERE admin_id = '{admin_id}';";
                    var response = connection.Query<RateSettings>(sql).FirstOrDefault();

                    return response;
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public List<Products> GetProductsCustomerFee(Guid partner_id)
        {
            try
            {
                using (var connection = new NpgsqlConnection(_connectionString))
                {
                    var sql = @$"SELECT p.* FROM partner.branch b
                                 JOIN catalog.product_branch pb on pb.branch_id = b.branch_id
                                 JOIN catalog.product p on pb.product_id = p.product_id
                                 WHERE b.partner_id ='{partner_id}' and p.active and p.sale_price > p.price;";

                    var response = connection.Query<Products>(sql).ToList();

                    return response;
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

    }
}