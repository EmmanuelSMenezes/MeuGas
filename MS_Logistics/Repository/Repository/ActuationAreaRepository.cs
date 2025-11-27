using System;
using System.Collections.Generic;
using System.Linq;
using Dapper;
using Domain.Model;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Newtonsoft.Json;
using Npgsql;
using Serilog;

namespace Infrastructure.Repository
{
    public class ActuationAreaRepository : IActuationAreaRepository
    {
        private readonly string _connectionString;
        private readonly ILogger _logger;
        public ActuationAreaRepository(string connectionString, ILogger logger)
        {
            _connectionString = connectionString;
            _logger = logger;
        }

        public ActuationAreaBD CreateActuationArea(CreateActuationAreaRequest createActuationAreaRequest)
        {
            try
            {
                var sql = @$"
          INSERT INTO logistics.actuation_area
          (geometry, partner_id, created_by, created_at, name, branch_id)
          VALUES(
            public.ST_GeomFromGeoJSON('{JsonConvert.SerializeObject(createActuationAreaRequest.Features[0].Geometry)}')
          , '{createActuationAreaRequest.Features[0].Properties.Partner_id}'
          , '{createActuationAreaRequest.Features[0].Properties.Created_by}'
          , CURRENT_TIMESTAMP
          , '{createActuationAreaRequest.Features[0].Properties.Name}'
          , '{createActuationAreaRequest.Features[0].Properties.Branch_id}'
          ) RETURNING
            actuation_area_id
          , partner_id
          , created_by
          , created_at
          , updated_at
          , active
          , name
          , updated_by
          , branch_id
          , public.ST_AsGeoJson(geometry) as GeometryJson;
        ";
                using (var connection = new NpgsqlConnection(_connectionString))
                {
                   
                    var response = connection.Query<ActuationAreaBD>(sql).FirstOrDefault();
                    _logger.Information("[ActuationAreaRepository - CreateActuationArea]: ActuationArea inserted in database!");

                    return response;
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "[ActuationAreaRepository - CreateActuationArea]: Error while insert actuation area on database!");
                throw ex;
            }
        }

        public ActuationAreaShippingResponse CreateActuationAreaShippingOptions(CreateActuationAreaShippingRequest createActuationAreaShippingRequest)
        {
            using (var connection = new NpgsqlConnection(_connectionString))
            {
                connection.Open();

                var transaction = connection.BeginTransaction();
                try
                {
                    
                    var sqlareaconfig = @$"INSERT INTO logistics.actuation_area_config(
                          actuation_area_id, start_hour, end_hour, created_by)
                     VALUES('{createActuationAreaShippingRequest.Actuation_area_id}','{createActuationAreaShippingRequest.Start_hour}',
                            '{createActuationAreaShippingRequest.End_hour}','{createActuationAreaShippingRequest.Created_by}') RETURNING *;";

                    var areaconfig = connection.Query<ActuationAreaConfig>(sqlareaconfig).FirstOrDefault();

                    var listday = new List<int>();
                    foreach (var day in createActuationAreaShippingRequest.Working_day)
                    {
                        var sqlday = @$"INSERT INTO logistics.working_day(day_number, actuation_area_config_id, created_by) 
                                        VALUES('{day}','{areaconfig.Actuation_area_config_id}','{createActuationAreaShippingRequest.Created_by}') 
                                        RETURNING day_number;";
                        var insertday = connection.Query<int>(sqlday).FirstOrDefault();
                        listday.Add(insertday);
                    }

                    var listpayment = new List<Guid>();
                    foreach (var payment in createActuationAreaShippingRequest.Payment)
                    {
                        var sqlpayment = @$"INSERT INTO logistics.actuation_area_payments(actuation_area_config_id, payment_options_id, created_by) 
                                            VALUES('{areaconfig.Actuation_area_config_id}','{payment}','{createActuationAreaShippingRequest.Created_by}') 
                                            RETURNING payment_options_id";
                        var insertpayment = connection.Query<Guid>(sqlpayment).FirstOrDefault();
                        listpayment.Add(insertpayment);
                    }

                    var listshipping = new List<ActuationAreaShipping>();
                    foreach (var item in createActuationAreaShippingRequest.Shipping_options)
                    {

                        var sqlinsert = @$"INSERT INTO logistics.actuation_area_shipping( 
                                            actuation_area_config_id, delivery_option_id, shipping_free, created_by, value) 
                                 VALUES ('{areaconfig.Actuation_area_config_id}', '{item.Delivery_options_id}',
                                         '{item.Shipping_free}', '{createActuationAreaShippingRequest.Created_by}',
                                          '{item.Value}') RETURNING *;";

                        var insertshippingoptions = connection.Query<ActuationAreaShipping>(sqlinsert).FirstOrDefault();
                        listshipping.Add(insertshippingoptions);
                    }

                    if (areaconfig == null || listshipping.Count != createActuationAreaShippingRequest.Shipping_options.Count ||
                        listday.Count != createActuationAreaShippingRequest.Working_day.Count ||
                        listpayment.Count != createActuationAreaShippingRequest.Payment.Count)
                    {
                        transaction.Dispose();
                        connection.Close();
                        throw new Exception("errorWhileInsertShippingOptionsOnDB");
                    }

                    transaction.Commit();
                    connection.Close();

                    return new ActuationAreaShippingResponse()
                    {
                        Actuation_area_Config = areaconfig,
                        Working_day = listday,
                        Payment = listpayment,
                        Actuation_area_shipping = listshipping
                    };
                }
                catch (Exception ex)
                {
                    _logger.Error(ex, "[ActuationAreaRepository - CreateActuationAreaShippingOptions]: Error while insert shipping options in actuation areas on database!");
                    throw ex;
                }
            }
        }

        public bool DeleteActuationArea(List<Guid> ids)
        {
            try
            {
                using (var connection = new NpgsqlConnection(_connectionString))
                {
                    foreach (var id in ids)
                    {
                        var sql = @$"
              DELETE FROM logistics.actuation_area
              WHERE actuation_area_id='{id}';
            ";
                        connection.Execute(sql);
                    }
                }
                _logger.Information("[ActuationAreaRepository - DeleteActuationArea]: Actuation Areas deleted in database!");
                return true;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "[ActuationAreaRepository - DeleteActuationArea]: Error while delete actuation areas on database!");
                throw ex;
            }
        }

        public ActuationAreaBD GetActuationAreaByActuationAreaId(Guid actuation_area_id)
        {
            try
            {
                var sql = @$"
          SELECT
            actuation_area_id
          , partner_id
          , branch_id
          , created_by
          , created_at
          , updated_at
          , active
          , name
          , updated_by
          , public.ST_AsGeoJson(geometry) as GeometryJson
          FROM logistics.actuation_area
          WHERE actuation_area_id = '{actuation_area_id}';
        ";
                using (var connection = new NpgsqlConnection(_connectionString))
                {
                    var response = connection.Query<ActuationAreaBD>(sql).FirstOrDefault();
                    _logger.Information("[ActuationAreaRepository - GetActuationAreaByActuationAreaId]: ActuationArea retrieved in database!");
                    return response;
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "[ActuationAreaRepository - GetActuationAreaByActuationAreaId]: Error while retrieve Actuation Area.");
                throw ex;
            }
        }

        public List<DeliveryOption> GetActuationAreaDeliveryOption()
        {
            try
            {
                var sql = @$"select * from logistics.actuation_area_delivery_option where active = true";

                using (var connection = new NpgsqlConnection(_connectionString))
                {
                    var response = connection.Query<DeliveryOption>(sql).ToList();

                    _logger.Information("[ActuationAreaRepository - GetActuationAreaDeliveryOption]: Delivery Option in Actuation Areas listing in database!");
                    return response;
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "[ActuationAreaRepository - GetActuationAreaDeliveryOption]: Error while listing Delivery Option in Actuation Areas.");
                throw ex;
            }
        }

        public List<ActuationAreaBD> GetActuationAreasByPartnerId(Guid partner_id, Filter filter)
        {
            try
            {
                var sql = @$"
          SELECT
            aa.actuation_area_id
          , aa.partner_id
          , aa.branch_id
          , aa.created_by
          , aa.created_at
          , aa.updated_at
          , aa.active
          , aa.name
          , aa.updated_by
          , public.ST_AsGeoJson(aa.geometry) as GeometryJson
          FROM logistics.actuation_area aa
          JOIN partner.branch b on aa.branch_id = b.branch_id
          WHERE aa.partner_id = '{partner_id}' and (upper(aa.name) like upper('%{filter.filter}%')
                                            or upper(b.branch_name) like upper('%{filter.filter}%'));
        ";
                using (var connection = new NpgsqlConnection(_connectionString))
                {
                    var response = connection.Query<ActuationAreaBD>(sql).ToList();
                    _logger.Information("[ActuationAreaRepository - GetActuationAreasByPartnerId]: Actuation Areas retrieved in database!");
                    return response;
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "[ActuationAreaRepository - GetActuationAreasByPartnerId]: Error while retrieve Actuation Areas.");
                throw ex;
            }
        }

        public ActuationAreaBD UpdateActuationArea(UpdateActuationAreaRequest updateActuationAreaRequest)
        {
            try
            {
                var sql = @$"
          UPDATE logistics.actuation_area
          SET
            geometry = public.ST_GeomFromGeoJSON('{JsonConvert.SerializeObject(updateActuationAreaRequest.Features[0].Geometry)}')
          , updated_at = CURRENT_TIMESTAMP
          , name = '{updateActuationAreaRequest.Features[0].Properties.Name}'
          , active = '{updateActuationAreaRequest.Features[0].Properties.Active}'
          , updated_by ='{updateActuationAreaRequest.Features[0].Properties.Updated_by}'
          WHERE
          partner_id = '{updateActuationAreaRequest.Features[0].Properties.Partner_id}' AND
          actuation_area_id = '{updateActuationAreaRequest.Features[0].Properties.Actuation_area_id}'
          RETURNING
            actuation_area_id
          , partner_id
          , branch_id
          , created_by
          , created_at
          , updated_at
          , active
          , name
          , updated_by
          , public.ST_AsGeoJson(geometry) as GeometryJson;
        ";
                using (var connection = new NpgsqlConnection(_connectionString))
                {
                    var response = connection.Query<ActuationAreaBD>(sql).FirstOrDefault();
                    _logger.Information("[ActuationAreaRepository - UpdateActuationArea]: ActuationArea updated in database!");
                    return response;
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "[ActuationAreaRepository - UpdateActuationArea]: Error while update actuation area on database!");
                throw ex;
            }
        }

        public ListActuationAreaConfig GetActuationAreaConfigByActuationAreaId(Guid actuation_area_id)
        {
            try
            {
                var sql = @$"select aa.name, c.*,
                               (
                               SELECT json_agg(day)
                            FROM (
                            SELECT wd.day_number, wd.working_day_id
                            FROM logistics.working_day wd
                            WHERE wd.actuation_area_config_id = c.actuation_area_config_id
                            ) day
                        ) AS working_day,
                        ( 
                            SELECT json_agg(payment)
                            FROM (
                            SELECT p.payment_options_id, po.description, p.actuation_area_payments_id
                            FROM logistics.actuation_area_payments p 
                            JOIN billing.payment_options po ON po.payment_options_id = p.payment_options_id
                            WHERE p.actuation_area_config_id = c.actuation_area_config_id
                            ) payment
                        ) AS payment_options,
                        ( 
                            SELECT json_agg(shipping)
                            FROM (
                            SELECT s.*,ad.name
                            FROM logistics.actuation_area_shipping s 
                            JOIN logistics.actuation_area_delivery_option ad ON ad.delivery_option_id = s.delivery_option_id
                            WHERE s.actuation_area_config_id = c.actuation_area_config_id
                            ) shipping
                        ) AS shipping_options
                        from logistics.actuation_area_config c
                        join logistics.actuation_area aa  on aa.actuation_area_id = c.actuation_area_id
                        where c.actuation_area_id = '{actuation_area_id}' order by c.created_at asc";

                using (var connection = new NpgsqlConnection(_connectionString))
                {
                    var response = connection.Query(sql).Select(x => new ListActuationAreaConfig()
                    {
                        Actuation_area_config_id = x.actuation_area_config_id,
                        Actuation_area_id = x.actuation_area_id,
                        Name = x.name,
                        Start_hour = x.start_hour,
                        End_hour = x.end_hour,
                        Working_days = !string.IsNullOrEmpty(x.working_day) ? JsonConvert.DeserializeObject< List<WorkingDay>>(x.working_day) : new List<WorkingDay>(),
                        Payment_options = !string.IsNullOrEmpty(x.payment_options) ? JsonConvert.DeserializeObject< List<PaymentOptions>>(x.payment_options) : new List<PaymentOptions>(),
                        Shipping_options = !string.IsNullOrEmpty(x.shipping_options) ? JsonConvert.DeserializeObject<List<ShippingOptions>>(x.shipping_options) : new List<ShippingOptions>(),
                        Created_by = x.created_by,
                        Created_at = x.created_at,
                        Updated_by = x.updated_by,
                        Updated_at = x.updated_at,
                    }).ToList();

                    _logger.Information("[ActuationAreaRepository - GetActuationAreaConfigByActuationAreaId]: Configuration Actuation Areas listing in database!");
                    return response.FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "[ActuationAreaRepository - GetActuationAreaConfigByActuationAreaId]: Error while listing Configuration Actuation Areas.");
                throw ex;
            }
        }

        public ActuationAreaShippingResponse UpdateActuationAreaShippingOptions(UpdateActuationAreaShippingRequest updateActuationAreaShippingRequest, ListActuationAreaConfig areaConfig)
        {
            using (var connection = new NpgsqlConnection(_connectionString))
            {
                connection.Open();

                var transaction = connection.BeginTransaction();
                try
                {
                    var sqlvaluemin = @$"UPDATE billing.pagseguro_value_minimum
                                        SET value_minimum='{updateActuationAreaShippingRequest.Value_minimum}',
                                            updated_by='{updateActuationAreaShippingRequest.Updated_by}', 
                                            updated_at='now()'
                                        WHERE pagseguro_value_minimum_id='{updateActuationAreaShippingRequest.Pagseguro_value_minimum_id}' RETURNING *";

                    var valuemin = connection.Query<dynamic>(sqlvaluemin).FirstOrDefault();

                    var sqlareaconfig = @$"UPDATE logistics.actuation_area_config SET
                                            start_hour = '{updateActuationAreaShippingRequest.Start_hour}', 
                                            end_hour = '{updateActuationAreaShippingRequest.End_hour}', 
                                            updated_by =  '{updateActuationAreaShippingRequest.Updated_by}',
                                            updated_at = now()
                                            WHERE Actuation_area_config_id = '{updateActuationAreaShippingRequest.Actuation_area_config_id}'
                                            RETURNING *;";

                    var areaactuationconfig = connection.Query<ActuationAreaConfig>(sqlareaconfig).FirstOrDefault();

                    var listday = new List<int>();
                    foreach (var day in updateActuationAreaShippingRequest.Working_day)
                    {
                        if (day?.Working_day_id == null)
                        {
                            var sqlday = @$"INSERT INTO logistics.working_day(day_number, actuation_area_config_id, created_by) 
                                        VALUES('{day.Day_number}','{areaactuationconfig.Actuation_area_config_id}','{updateActuationAreaShippingRequest.Updated_by}') 
                                        RETURNING day_number;";

                            var insertday = connection.Query<int>(sqlday).FirstOrDefault();
                           listday.Add(insertday);
                        }
                        else
                        {
                            var sqlday = @$"UPDATE logistics.working_day SET
                                    day_number = {day.Day_number}, 
                                    updated_by = '{updateActuationAreaShippingRequest.Updated_by}',
                                    updated_at = now()
                                    WHERE Working_day_id = '{day.Working_day_id}'
                                    RETURNING day_number;";

                            var updateday = connection.Query<int>(sqlday).FirstOrDefault();
                            listday.Add(updateday);
                            areaConfig.Working_days.RemoveAll(x => x.Working_day_id == day.Working_day_id);
                        }
                       
                    }

                    var listpayment = new List<Guid>();
                    foreach (var payment in updateActuationAreaShippingRequest.Payment)
                    {
                        if (payment?.Actuation_area_payments_id == null)
                        {
                            var sqlpayment = @$"INSERT INTO logistics.actuation_area_payments(actuation_area_config_id, payment_options_id, created_by) 
                                            VALUES('{areaactuationconfig.Actuation_area_config_id}','{payment.Payment_options_id}','{updateActuationAreaShippingRequest.Updated_by}') 
                                            RETURNING payment_options_id";
                            var insertpayment = connection.Query<Guid>(sqlpayment).FirstOrDefault();
                            listpayment.Add(insertpayment);
                        }else
                        {
                            var sqlpayment = @$"UPDATE logistics.actuation_area_payments SET
                                            payment_options_id = '{payment.Payment_options_id}', 
                                            updated_by = '{updateActuationAreaShippingRequest.Updated_by}',
                                            updated_at = now()
                                            WHERE Actuation_area_payments_id = '{payment.Actuation_area_payments_id}' 
                                            RETURNING payment_options_id";
                            var updatepayment = connection.Query<Guid>(sqlpayment).FirstOrDefault();
                            listpayment.Add(updatepayment);

                            areaConfig.Payment_options.RemoveAll(x => x.Actuation_area_payments_id == payment.Actuation_area_payments_id);
                        }
                        
                    }

                    var listshipping = new List<ActuationAreaShipping>();
                    foreach (var item in updateActuationAreaShippingRequest.Shipping_options)
                    {
                        if (item?.Actuation_area_shipping_id == null)
                        {
                            var sqlinsert = @$"INSERT INTO logistics.actuation_area_shipping( 
                                            actuation_area_config_id, delivery_option_id, shipping_free, created_by, value) 
                                 VALUES ('{areaactuationconfig.Actuation_area_config_id}', '{item.Delivery_option_id}',
                                         '{item.Shipping_free}', '{updateActuationAreaShippingRequest.Updated_by}',
                                          '{item.Value}') RETURNING *;";

                            var insertshippingoptions = connection.Query<ActuationAreaShipping>(sqlinsert).FirstOrDefault();
                            listshipping.Add(insertshippingoptions);
                        }
                        else
                        {
                            var sqlinsert = @$"UPDATE logistics.actuation_area_shipping SET
                                            shipping_free = {item.Shipping_free}, 
                                            updated_by = '{updateActuationAreaShippingRequest.Updated_by}', 
                                            updated_at = now(), 
                                            value = {item.Value} 
                                            WHERE Actuation_area_shipping_id = '{item.Actuation_area_shipping_id}'
                                            RETURNING *;";

                            var insertshippingoptions = connection.Query<ActuationAreaShipping>(sqlinsert).FirstOrDefault();
                            listshipping.Add(insertshippingoptions);
                            areaConfig.Shipping_options.RemoveAll(x => x.Actuation_area_shipping_id == item.Actuation_area_shipping_id);
                        }
                       
                    }

                    var deleteday = 0;
                    foreach (var day in areaConfig.Working_days)
                    {
                        var sql = @$"DELETE FROM logistics.working_day
                                     WHERE delivery_option_id = '{day.Working_day_id}'";

                        deleteday += connection.Execute(sql);

                    }

                    var deletepayment = 0;
                    foreach (var payment in areaConfig.Payment_options)
                    {
                        var sql = @$"DELETE FROM logistics.actuation_area_payments
                                     WHERE actuation_area_payments_id = '{payment.Actuation_area_payments_id}'";

                        deletepayment += connection.Execute(sql);
                    }

                    var deleteshipping = 0;
                    foreach (var shipping in areaConfig.Shipping_options)
                    {
                        var sql = @$"DELETE FROM logistics.actuation_area_shipping
                                     WHERE actuation_area_shipping_id = '{shipping.Actuation_area_shipping_id}'";

                        deleteshipping += connection.Execute(sql);
                    }

                    if (valuemin == null || areaactuationconfig == null || listshipping.Count != updateActuationAreaShippingRequest.Shipping_options.Count ||
                        listday.Count != updateActuationAreaShippingRequest.Working_day.Count ||
                        listpayment.Count != updateActuationAreaShippingRequest.Payment.Count || areaConfig.Working_days.Count!= deleteday ||
                        areaConfig.Payment_options.Count != deletepayment || areaConfig.Shipping_options.Count != deleteshipping)
                    {
                        transaction.Dispose();
                        connection.Close();
                        throw new Exception("errorWhileUpdateShippingOptionsOnDB");
                    }

                    transaction.Commit();
                    connection.Close();

                    return new ActuationAreaShippingResponse()
                    {
                        Actuation_area_Config = areaactuationconfig,
                        Working_day = listday,
                        Payment = listpayment,
                        Actuation_area_shipping = listshipping
                    };
                }
                catch (Exception ex)
                {
                    _logger.Error(ex, "[ActuationAreaRepository - UpdateActuationAreaShippingOptions]: Error while Update shipping options in actuation areas on database!");
                    throw ex;
                }
            }
        }

    }
}
