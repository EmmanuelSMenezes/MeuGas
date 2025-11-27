using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Xml.Linq;
using Dapper;
using Domain.Model;
using Npgsql;
using Serilog;

namespace Infrastructure.Repository
{
    public class SettingsRepository : ISettingsRepository
    {
        private readonly string _connectionString;
        private readonly ILogger _logger;
        public SettingsRepository(string connectionString, ILogger logger)
        {
            _connectionString = connectionString;
            _logger = logger;
        }

        public RateSettingsResponse CreatedRateSettingsRepository(CreatedRateSettingsRequest createRateSettings)
        {
            try
            {
                using (var connection = new NpgsqlConnection(_connectionString))
                {
                    var sql = @$"INSERT INTO administrator.interest_rate_setting
                                (admin_id, service_fee, card_fee, created_by)
                                VALUES('{createRateSettings.Admin_id}','{createRateSettings.Service_fee.ToString().Replace(",", ".")}','{createRateSettings.Card_fee.ToString().Replace(",", ".")}','{createRateSettings.Created_by}') RETURNING *;";

                    var response = connection.Query<RateSettingsResponse>(sql).FirstOrDefault();

                    return response;
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public StyleConsumerResponse CreateStyleConsumerRepository(CreateStyleRequest styleRequest)
        {
            try
            {
                using (var connection = new NpgsqlConnection(_connectionString))
                {
                    var sql = @$"INSERT INTO consumer.style_consumer
	                            (""primary"", ""text"", created_by, admin_id) 
                                VALUES ('{styleRequest.Main}','{styleRequest.Dark}','{styleRequest.Created_by}','{styleRequest.Admin_id}') RETURNING *";

                    var response = connection.Query(sql).Select(x => new StyleConsumerResponse()
                    {
                        colors = new Colors()
                        {
                            primary = x.primary,
                            text = x.text,
                            primaryBackground = x.primarybackground,
                            secondary = x.secondary,
                            black = x.black,
                            gray = x.gray,
                            lightgray = x.lightgray,
                            white = x.white,
                            background = x.background,
                            shadow = x.shadow,
                            shadowPrimary = x.shadowprimary,
                            success = x.success,
                            danger = x.danger,
                            warning = x.warning,
                            blue = x.blue,
                            shadowBlue = x.shadowblue,
                            gold = x.gold,
                            orange = x.orange

                        },
                        fonts = new Fonts()
                        {
                            light_italic = x.light_italic,
                            light = x.light,
                            italic = x.italic,
                            regular = x.regular,
                            medium = x.medium,
                            bold = x.bold
                        }
                    }).ToList();

                    return response.FirstOrDefault();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public StylePartnerResponse CreateStylePartnerRepository(CreateStyleRequest stylePartnerRequest)
        {
            try
            {
                using (var connection = new NpgsqlConnection(_connectionString))
                {
                    var sql = @$"INSERT INTO partner.style_partner
                                (admin_id, 
                                lighter, 
                                light, 
                                main, 
                                dark, 
                                darker, 
                                contrasttext, 
                                created_by,
                                logo)  
                                 VALUES('{stylePartnerRequest.Admin_id}','{stylePartnerRequest.Lighter}','{stylePartnerRequest.Light}','{stylePartnerRequest.Main}'
                                ,'{stylePartnerRequest.Dark}','{stylePartnerRequest.Darker}','{stylePartnerRequest.Contrasttext}','{stylePartnerRequest.Created_by}','{stylePartnerRequest.Url}') RETURNING *";

                    var response = connection.Query<StylePartnerResponse>(sql).FirstOrDefault();

                    return response;
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public RateSettingsResponse GetRateSettingsAdminRepository(Guid admin_id)
        {
            try
            {
                using (var connection = new NpgsqlConnection(_connectionString))
                {
                    var sql = @$"SELECT * FROM administrator.interest_rate_setting WHERE admin_id = '{admin_id}';";
                    var response = connection.Query<RateSettingsResponse>(sql).FirstOrDefault();

                    return response;
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public StyleConsumerResponse GetStyleConsumerRepository()
        {
            try
            {
                using (var connection = new NpgsqlConnection(_connectionString))
                {
                    var sql = @$"SELECT * FROM consumer.style_consumer";

                    var response = connection.Query(sql).Select(x => new StyleConsumerResponse()
                    {
                        colors = new Colors()
                        {
                            primary = x.primary,
                            text = x.text,
                            primaryBackground = x.primarybackground,
                            secondary = x.secondary,
                            black = x.black,
                            gray = x.gray,
                            lightgray = x.lightgray,
                            white = x.white,
                            background = x.background,
                            shadow = x.shadow,
                            shadowPrimary = x.shadowprimary,
                            success = x.success,
                            danger = x.danger,
                            warning = x.warning,
                            blue = x.blue,
                            shadowBlue = x.shadowblue,
                            gold = x.gold,
                            orange = x.orange

                        },
                        fonts = new Fonts()
                        {
                            light_italic = x.light_italic,
                            light = x.light,
                            italic = x.italic,
                            regular = x.regular,
                            medium = x.medium,
                            bold = x.bold
                        }
                    }).ToList();

                    return response.FirstOrDefault();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public StylePartnerResponse GetStylePartnerRepository(Guid admin_id)
        {
            try
            {
                using (var connection = new NpgsqlConnection(_connectionString))
                {
                    var sql = @$"SELECT * FROM partner.style_partner WHERE admin_id = '{admin_id}';";
                    var response = connection.Query<StylePartnerResponse>(sql).FirstOrDefault();

                    return response;
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public RateSettingsResponse UpdatedRateSettingsRepository(UpdatedRateSettingsRequest updatedRateSettingsRequest)
        {
            try
            {
                using (var connection = new NpgsqlConnection(_connectionString))
                {
                    var sql = @$"UPDATE administrator.interest_rate_setting
                                 SET service_fee='{updatedRateSettingsRequest.Service_fee.ToString().Replace(",",".")}'
                                    , card_fee='{updatedRateSettingsRequest.Card_fee.ToString().Replace(",", ".")}'
                                    , updated_by='{updatedRateSettingsRequest.Updated_by}'
                                    , updated_at=CURRENT_TIMESTAMP
                                 WHERE interest_rate_setting_id='{updatedRateSettingsRequest.Interest_rate_setting_id}' RETURNING *";

                    var response = connection.Query<RateSettingsResponse>(sql).FirstOrDefault();

                    return response;
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public StyleConsumerResponse UpdateStyleConsumerRepository(UpdateStyleRequest stylePartnerRequest)
        {
            try
            {
                using (var connection = new NpgsqlConnection(_connectionString))
                {
                    var sql = @$"UPDATE consumer.style_consumer SET
                              
                               ""primary"" = '{stylePartnerRequest.Main}'
                               , ""text"" = '{stylePartnerRequest.Dark}'                              
                               , updated_by = '{stylePartnerRequest.Updated_by}'
                               , updated_at = CURRENT_TIMESTAMP
                               WHERE admin_id = '{stylePartnerRequest.Admin_id}' RETURNING *";

                    var response = connection.Query(sql).Select(x => new StyleConsumerResponse()
                    {
                        colors = new Colors()
                        {
                            primary = x.primary,
                            text = x.text,
                            primaryBackground = x.primarybackground,
                            secondary = x.secondary,
                            black = x.black,
                            gray = x.gray,
                            lightgray = x.lightgray,
                            white = x.white,
                            background = x.background,
                            shadow = x.shadow,
                            shadowPrimary = x.shadowprimary,
                            success = x.success,
                            danger = x.danger,
                            warning = x.warning,
                            blue = x.blue,
                            shadowBlue = x.shadowblue,
                            gold = x.gold,
                            orange = x.orange

                        },
                        fonts = new Fonts()
                        {
                            light_italic = x.light_italic,
                            light = x.light,
                            italic = x.italic,
                            regular = x.regular,
                            medium = x.medium,
                            bold = x.bold
                        }
                    }).ToList();

                    return response.FirstOrDefault();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public StylePartnerResponse UpdateStylePartnerRepository(UpdateStyleRequest stylePartnerRequest)
        {
            try
            {
                using (var connection = new NpgsqlConnection(_connectionString))
                {
                    var sql = @$"UPDATE partner.style_partner SET
                              
                               lighter = '{stylePartnerRequest.Lighter}'
                               , light = '{stylePartnerRequest.Light}'
                               , main = '{stylePartnerRequest.Main}'
                               , dark = '{stylePartnerRequest.Dark}'
                               , darker = '{stylePartnerRequest.Darker}'
                               , contrasttext = '{stylePartnerRequest.Contrasttext}'
                               , updated_by = '{stylePartnerRequest.Updated_by}'
                               , updated_at = CURRENT_TIMESTAMP
                               , logo = '{stylePartnerRequest.Url}' 
                               WHERE admin_id = '{stylePartnerRequest.Admin_id}' RETURNING *";

                    var response = connection.Query<StylePartnerResponse>(sql).FirstOrDefault();

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
