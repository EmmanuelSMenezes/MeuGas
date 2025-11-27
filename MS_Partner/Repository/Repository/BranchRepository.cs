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
    public class BranchRepository : IBranchRepository
    {
        private readonly string _connectionString;
        private readonly ILogger _logger;

        public BranchRepository(string connectionString, ILogger logger)
        {
            _connectionString = connectionString;
            _logger = logger;
        }

        public Branch Create(CreateBranchRequest branch)
        {
            try
            {
                using (var connection = new NpgsqlConnection(_connectionString))
                {
                    // INSERINDO NOVA UNIDADE/unidade
                    string sqlInsertBranch = $@"INSERT INTO partner.branch
                                (
                                    branch_name, document, partner_id, phone, created_by
                                )
                                VALUES
                                (
                                   '{branch.Branch_name}'
                                   ,'{branch.Document}'
                                   ,'{branch.Partner_id}'
                                   ,'{branch.Phone}'
                                   ,'{branch.Created_by}'
                                ) RETURNING *;";

                    connection.Open();

                    var transaction = connection.BeginTransaction();

                    var insertedBranch = connection.Query<Branch>(sqlInsertBranch).FirstOrDefault();

                    // CADASTRANDO ENDEREÇO DA UNIDADE/unidade
                    string sqlInsertAddress = $@"INSERT INTO partner.address
                                                (
                                                  street, number, complement, district, city, state, zip_code, latitude, longitude, branch_id, created_by
                                                )
                                                VALUES
                                                (
                                                    '{branch.Address.Street}'
                                                   ,'{branch.Address.Number}'
                                                   ,'{branch.Address.Complement}'
                                                   ,'{branch.Address.District}'
                                                   ,'{branch.Address.City}'
                                                   ,'{branch.Address.State}'
                                                   ,'{branch.Address.Zip_code}'
                                                   ,'{branch.Address.Latitude}'
                                                   ,'{branch.Address.Longitude}'
                                                   ,'{insertedBranch.Branch_id}'
                                                   ,'{branch.Created_by}'
                                                ) RETURNING *;";

                    var insertedAdress = connection.Query<Address>(sqlInsertAddress).FirstOrDefault();

                    if (insertedBranch == null || insertedAdress == null)
                    {
                        transaction.Dispose();
                        connection.Close();
                        throw new Exception("errorWhileInsertBranchOnDB");
                    }

                    transaction.Commit();
                    connection.Close();
                    insertedBranch.Address = insertedAdress;
                    return insertedBranch;
                }
            }
            catch (Exception)
            {
                throw new Exception("errorWhileInsertBranchOnDB");
            }
        }

        public Branch Update(Branch branch)
        {
            try
            {
                using (var connection = new NpgsqlConnection(_connectionString))
                {
                    // ATUALIZANDO UNIDADE
                    string sqlUpdateBranch = $@"UPDATE partner.branch SET 
                                                     branch_name = '{branch.Branch_name}'
                                                   , phone = '{branch.Phone}'
                                                   , document = '{branch.Document}'
                                                   , updated_by = '{branch.Updated_by}'
                                                   , updated_at = NOW()
                                                   , active = {branch.Active}
                                                WHERE branch_id='{branch.Branch_id}' RETURNING *;";

                    connection.Open();

                    var transaction = connection.BeginTransaction();

                    var updatedBranch = connection.Query<Branch>(sqlUpdateBranch).FirstOrDefault();

                    // ATUALIZANDO ENDEREÇO
                    string sqlUpdateAddress = $@"UPDATE partner.address SET 
                                                    street = '{branch.Address.Street}'
                                                  , number = '{branch.Address.Number}'
                                                  , complement = '{branch.Address.Complement}'
                                                  , district = '{branch.Address.District}'
                                                  , city = '{branch.Address.City}'
                                                  , state = '{branch.Address.State}'
                                                  , zip_code = '{branch.Address.Zip_code}'
                                                  , updated_by = '{branch.Updated_by}'
                                                  , updated_at = NOW()
                                                  , active = {branch.Address.Active}
                                                  , latitude = '{branch.Address.Latitude}'
                                                  , longitude = '{branch.Address.Longitude}'
                                                WHERE branch_id='{updatedBranch.Branch_id}' RETURNING*;";

                    var updatedAddress = connection.Query<Address>(sqlUpdateAddress).FirstOrDefault();

                    if (updatedAddress == null || updatedBranch == null)
                    {
                        transaction.Dispose();
                        connection.Close();
                        throw new Exception("errorWhileUpdateBranchOnDB");
                    }

                    transaction.Commit();
                    connection.Close();

                    updatedBranch.Address = updatedAddress;
                    return updatedBranch;
                }
            }
            catch (Exception)
            {
                throw new Exception("errorWhileUpdateBranchOnDB");
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
                        // Verificar se existe o Branch_id no banco de dados
                        string queryBranchId = $@"SELECT * FROM partner.branch WHERE branch_id = '{item}'";
                        var branchId = connection.Query<Branch>(queryBranchId).FirstOrDefault();

                        if (branchId != null)
                        {
                            // EXCLUINDO ENDEREÇO DA UNIDADE
                            string sqlDeleteAddress = $@"DELETE FROM partner.address WHERE branch_id = '{branchId.Branch_id}' RETURNING*;";
                            var deletedAddress = connection.Query<Branch>(sqlDeleteAddress).FirstOrDefault();

                            //EXCLUINDO UNIDADE
                            string sqlDeleteBranch = $@"DELETE FROM partner.branch WHERE branch_id = '{branchId.Branch_id}' RETURNING*;";
                            var deletedBranch = connection.Query<Branch>(sqlDeleteBranch).FirstOrDefault();

                            if (deletedAddress == null || deletedBranch == null)
                            {
                                transaction.Dispose();
                                connection.Close();
                                throw new Exception("errorWhileDeleteBranchOnDB");
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
                throw new Exception("errorWhileDeleteBranchOnDB");
            }
        }

        public List<Branch> GetBranchs()
        {
            try
            {
                string sql = $@"SELECT * FROM partner.branch";

                using (var connection = new NpgsqlConnection(_connectionString))
                {
                    List<Branch> branch = new List<Branch>();
                    var response = connection.Query<Branch>(sql).ToList<Branch>();
                    foreach (var branchItem in response)
                    {
                        var sqlAddress = @$"SELECT * FROM partner.address WHERE branch_id = '{branchItem.Branch_id}'";
                        var responseAddress = connection.Query<Address>(sqlAddress).FirstOrDefault();
                        branchItem.Address = responseAddress;
                        branch.Add(branchItem);
                    }
                    if (response == null)
                    {
                        throw new Exception("branchNotCreated");
                    }
                    return branch;
                }
            }
            catch (Exception)
            {
                throw new Exception("errorGetBranchs");
            }
        }

        public bool GetBranchByDocument(string document)
        {
            try
            {
                string sql = $@"SELECT * FROM partner.branch WHERE document = '{document}';";

                using (var connection = new NpgsqlConnection(_connectionString))
                {
                    var response = connection.Query<Branch>(sql).FirstOrDefault();
                    if (response != null) return false;
                    return true;
                }
            }
            catch (Exception)
            {
                throw new Exception();
            }
        }

        public Branch GetBranchById(string id)
        {
            try
            {
                string sql = $@"SELECT * FROM partner.branch WHERE branch_id = '{id}';";

                using (var connection = new NpgsqlConnection(_connectionString))
                {
                    var response = connection.Query<Branch>(sql).FirstOrDefault();
                    if (response == null)
                    {
                        throw new Exception("branchNotCreated");
                    }
                    return response;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<Branch> GetBranchsByPartnerId(Guid partner_id)
        {
            try
            {
                string sql = $@"SELECT * FROM partner.branch WHERE partner_id = '{partner_id}';";

                using (var connection = new NpgsqlConnection(_connectionString))
                {
                    List<Branch> branch = new List<Branch>();
                    var response = connection.Query<Branch>(sql).ToList<Branch>();
                    foreach (var branchItem in response)
                    {
                        var sqlAddress = @$"SELECT * FROM partner.address WHERE branch_id = '{branchItem.Branch_id}'";
                        var responseAddress = connection.Query<Address>(sqlAddress).FirstOrDefault();
                        branchItem.Address = responseAddress;
                        branch.Add(branchItem);
                    }
                    if (response == null)
                    {
                        throw new Exception("branchNotCreated");
                    }
                    return branch;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public ListBranchResponse ListBranchsByPartnerId(Guid partner_id, Filter filter)
        {
            try
            {


                using (var connection = new NpgsqlConnection(_connectionString))
                {

                    var sql = @$"SELECT b.*,
                                     (SELECT 
                                          to_jsonb(a.*) address
                                          FROM partner.address a where a.branch_id = b.branch_id)
                                    FROM partner.branch b WHERE b.partner_id = '{partner_id}' and upper(b.branch_name) like upper('%{filter.filter}%')";

                    var response = connection.Query(sql).Select(x => new Branch()
                    {
                        Branch_id = x.branch_id,
                        Branch_name = x.branch_name,
                        Document = x.document,
                        Phone = x.phone,
                        Partner_id = x.partner_id,
                        Address = (!string.IsNullOrEmpty(x.address) ? JsonConvert.DeserializeObject<Address>(x.address) : new Address()),
                        Created_by = x.created_by,
                        Created_at = x.created_at,
                        Updated_by = x.updated_by,
                        Updated_at = x.updated_at,
                        Active = x.active
                    }).ToList();

                    int totalRows = response.Count();
                    float totalPages = (float)totalRows / (float)filter.itensPerPage;

                    totalPages = (float)Math.Ceiling(totalPages);

                    response = response.Skip((int)((filter.page - 1) * filter.itensPerPage)).Take((int)filter.itensPerPage).ToList();

                    if (response == null)
                    {
                        throw new Exception("branchNotCreated");
                    }
                    return new ListBranchResponse()
                    {
                        Branches = response,
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
                throw ex;
            }
        }

        public DetailsBranch ListDetailsBranch(Guid branch_id, Filter filter)
        {
            try
            {
                using (var connection = new NpgsqlConnection(_connectionString))
                {
                    var sql = @$"                                
                               SELECT b.branch_id,
       b.branch_name,
       b.partner_id,
       u.avatar,
       (SELECT COALESCE(
       ( Sum(r.rating_value) / Count(DISTINCT( br.rating_id )) ), 0)
        FROM   reputation.branch_rating br
               JOIN reputation.rating r
                 ON r.rating_id = br.rating_id
        WHERE  br.branch_id = b.branch_id)                  ratings,
       (SELECT Json_agg(product)
        FROM   (SELECT cp.product_id, cp.identifier, cp.name, cp.price, cp.image_default,(select pi.url from catalog.product_image pi where pi.product_image_id = cp.image_default),
                       (SELECT Json_agg(category)
                        FROM   (SELECT c.category_id, c.identifier, c.description,c.category_parent_id,
                                       (SELECT
                               description AS category_parent_name
                                        FROM   catalog.category
                                        WHERE
                               category_id = c.category_parent_id)
                                FROM   catalog.category_base_product cbp
                                       JOIN catalog.category c
                                         ON c.category_id = cbp.category_id
                                WHERE  cbp.product_id = cp.base_product_id)
                               category)
                       AS
                               categories
                FROM   catalog.product_branch pb
                       JOIN catalog.product cp
                         ON cp.product_id = pb.product_id and cp.active = true
                
                WHERE  pb.branch_id = b.branch_id) product) AS products,
                (SELECT 
                                          to_jsonb(a.*) address
                                          FROM partner.address a where a.branch_id = b.branch_id)
FROM   partner.branch b
       JOIN partner.partner p
         ON p.partner_id = b.partner_id
       JOIN authentication.profile u
         ON u.user_id = p.user_id
WHERE  b.branch_id = '{branch_id}' ";

                    var response = connection.Query(sql).Select(x => new DetailsBranch()
                    {
                        Branch_id = x.branch_id,
                        Branch_name = x.branch_name,
                        Partner_id = x.partner_id,
                        Ratings = x.ratings,
                        Avatar = x.avatar,
                        Product = new ListProduct()
                        {
                            Products = !string.IsNullOrEmpty(x.products) ? JsonConvert.DeserializeObject<List<Product>>(x.products) : new List<Product>(),
                            Pagination = new Pagination() { }
                        },
                        Address = !string.IsNullOrEmpty(x.address) ? JsonConvert.DeserializeObject<Address>(x.address) : new Address()

                    }).ToList();


                    int totalRows = response.First().Product.Products.Count();
                    float totalPages = (float)totalRows / (float)filter.itensPerPage;

                    totalPages = (float)Math.Ceiling(totalPages);

                    response.First().Product.Products = response.First().Product.Products.Skip((int)((filter.page - 1) * filter.itensPerPage)).Take((int)filter.itensPerPage).ToList();
                    response.First().Product.Pagination.totalPages = (int)totalPages;
                    response.First().Product.Pagination.totalRows = totalRows;
                    return response.FirstOrDefault();
                }
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
    }
}
