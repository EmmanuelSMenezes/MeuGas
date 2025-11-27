using System;
using Domain.Model;
using Serilog;

namespace Application.Service
{
  public class EmailTemplateService : IEmailTemplateService
  {
    private readonly ILogger _logger;
    public EmailTemplateService(
      ILogger logger
    )
    {
      _logger = logger;
    }

    public BaseTemplateReturn ForgotPassword(ForgotPassword forgotPassword)
    {
      try
      {
        return new BaseTemplateReturn() {
          Subject = $"PAM Platform - Esqueci minha Senha - {forgotPassword.PortalName}",
          Body = @$"<td class='esd-stripe' align='center'>
            <table class='es-content-body' style='background-color: #ffffff; background-image: url(https://mtvjbz.stripocdn.email/content/guids/CABINET_10a46408783042489135d8b269177e5f/images/rectangle_26.png); background-repeat: no-repeat; background-position: center top;' width='600' cellspacing='0' cellpadding='0' bgcolor='#ffffff' align='center' background='https://mtvjbz.stripocdn.email/content/guids/CABINET_10a46408783042489135d8b269177e5f/images/rectangle_26.png'>
                <tbody>
                    <tr>
                        <td class='esd-structure es-p20t es-p20r es-p20l' align='left'>
                            <table cellpadding='0' cellspacing='0' width='100%'>
                                <tbody>
                                    <tr>
                                        <td width='560' class='es-m-p0r esd-container-frame' valign='top' align='center'>
                                            <table cellpadding='0' cellspacing='0' width='100%'>
                                                <tbody>
                                                    <tr>
                                                        <td align='center' class='esd-block-text'>
                                                            <p style='font-size: 45px;'><strong>PAM Plataform</strong></p>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td class='esd-structure es-p20' align='left'>
                            <table cellspacing='0' cellpadding='0' width='100%'>
                                <tbody>
                                    <tr>
                                        <td width='560' align='left' class='esd-container-frame'>
                                            <table cellpadding='0' cellspacing='0' width='100%'>
                                                <tbody>
                                                    <tr>
                                                        <td align='center' class='esd-block-image es-p20t es-p20b' style='font-size: 0px;'><a><img src='https://w7.pngwing.com/pngs/262/508/png-transparent-teplogidrostroy-password-manager-admin-icon-data-teplogidrostroy-system-thumbnail.png' alt style='display: block;' height='230'></a></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class='es-m-p0r esd-container-frame' width='560' valign='top' align='center'>
                                            <table width='100%' cellspacing='0' cellpadding='0'>
                                                <tbody>
                                                    <tr>
                                                        <td align='center' class='esd-block-text es-p20b'>
                                                            <h2 style='font-family: arial, 'helvetica neue', helvetica, sans-serif;'>Redefinição de Senha</h2>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td align='left' class='esd-block-text es-p20t es-p15b'>
                                                            <p>Olá&nbsp;{forgotPassword.User_fullName},</p>
                                                            <p><br></p>
                                                            <p>Segue link para redefinição de senha:</p>
                                                            <p><br></p>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td align='center' class='esd-block-spacer es-p20' style='font-size:0'>
                                                            <table border='0' width='100%' height='100%' cellpadding='0' cellspacing='0'>
                                                                <tbody>
                                                                    <tr>
                                                                        <td style='border-bottom: 1px solid #cccccc; background: unset; height:1px; width:100%; margin:0px 0px 0px 0px;'></td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class='esd-block-html esdev-disable-select'>
                                                            <br />
                                                            <br />
                                                            <br />
                                                            <div style='text-align: center;'>
                                                                <a href='{forgotPassword.BaseUrlWebAppWithToken}' style='padding: 10px; background: green; border-radius: 8px; text-decoration: none; color: #FFF;'>Redefinir a Senha</a>
                                                            </div>
                                                            <br />
                                                            <br />
                                                            <br />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td align='center' class='esd-block-spacer es-p20' style='font-size:0'>
                                                            <table border='0' width='100%' height='100%' cellpadding='0' cellspacing='0'>
                                                                <tbody>
                                                                    <tr>
                                                                        <td style='border-bottom: 1px solid #cccccc; background: unset; height:1px; width:100%; margin:0px 0px 0px 0px;'></td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </td>"
        };
      }
      catch (Exception ex)
      {
        _logger.Error(ex, @$"[EmailTemplateService - ForgotPassword]: Error to generate ForgotPassword Template.");
        throw;
      }
    }

    public BaseTemplateReturn FirstAccessPartner(FirstAccessPartner firstAccessPartner)
    {
      try
      {
        return new BaseTemplateReturn() {
          Subject = $"PAM Platform - Primeiro Acesso - Parceiro",
          Body = @$"<td class='esd-stripe' align='center'>
              <table class='es-content-body' style='background-color: #ffffff;' width='600' cellspacing='0' cellpadding='0' bgcolor='#ffffff' align='center'>
                  <tbody>
                      <tr>
                          <td class='esd-structure es-p20t es-p20r es-p20l' align='left'>
                              <table cellpadding='0' cellspacing='0' width='100%'>
                                  <tbody>
                                      <tr>
                                          <td width='560' class='es-m-p0r esd-container-frame' valign='top' align='center'>
                                              <table cellpadding='0' cellspacing='0' width='100%'>
                                                  <tbody>
                                                      <tr>
                                                          <td align='center' class='esd-block-text'>
                                                              <p style='font-size: 45px;'><strong>PAM Platform</strong></p>
                                                          </td>
                                                      </tr>
                                                  </tbody>
                                              </table>
                                          </td>
                                      </tr>
                                  </tbody>
                              </table>
                          </td>
                      </tr>
                      <tr>
                          <td class='esd-structure es-p20' align='left'>
                              <table cellspacing='0' cellpadding='0' width='100%'>
                                  <tbody>
                                      <tr>
                                          <td width='560' align='left' class='esd-container-frame'>
                                              <table cellpadding='0' cellspacing='0' width='100%'>
                                                  <tbody>
                                                      <tr>
                                                          <td align='center' class='esd-block-image es-p20t es-p20b' style='font-size: 0px;'><a href='#'><img src='https://w7.pngwing.com/pngs/262/508/png-transparent-teplogidrostroy-password-manager-admin-icon-data-teplogidrostroy-system-thumbnail.png' alt style='display: block;' height='230'></a></td>
                                                      </tr>
                                                  </tbody>
                                              </table>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td class='es-m-p0r esd-container-frame' width='560' valign='top' align='center'>
                                              <table width='100%' cellspacing='0' cellpadding='0'>
                                                  <tbody>
                                                      <tr>
                                                          <td align='center' class='esd-block-text es-p20b'>
                                                              <h2 style='font-family: arial, 'helvetica neue', helvetica, sans-serif;'>Bem Vindo a PAM Plataform</h2>
                                                          </td>
                                                      </tr>
                                                      <tr>
                                                          <td align='left' class='esd-block-text es-p20t es-p15b'>
                                                              <p>Olá&nbsp;{firstAccessPartner.User_fullName},</p>
                                                              <p><br></p>
                                                              <p>Segue dados para seu primeiro login em nossa plataforma, assim que logar será solicitado que você insira uma nova senha e conclua o cadastro:</p>
                                                              <p><br></p>
                                                          </td>
                                                      </tr>
                                                      <tr>
                                                          <td align='center' class='esd-block-spacer es-p20' style='font-size:0'>
                                                              <table border='0' width='100%' height='100%' cellpadding='0' cellspacing='0'>
                                                                  <tbody>
                                                                      <tr>
                                                                          <td style='border-bottom: 1px solid #cccccc; background: unset; height:1px; width:100%; margin:0px 0px 0px 0px;'></td>
                                                                      </tr>
                                                                  </tbody>
                                                              </table>
                                                          </td>
                                                      </tr>
                                                      <tr>
                                                          <td class='esd-block-html esdev-disable-select'>
                                                              <table style='font-family: arial, sans-serif; border-collapse: collapse; width: 100%;'>
                                                                  <tbody>
                                                                      <tr>
                                                                          <th style='border: 1px solid #dddddd; text-align: left; padding: 8px;'>Email:</th>
                                                                          <td style='border: 1px solid #dddddd; text-align: left; padding: 8px;'>{firstAccessPartner.User_Email}</td>
                                                                      </tr>
                                                                      <tr>
                                                                          <th style='border: 1px solid #dddddd; text-align: left; padding: 8px;'>Senha:</th>
                                                                          <td style='border: 1px solid #dddddd; text-align: left; padding: 8px;'>{firstAccessPartner.GeneratedPassword}</td>
                                                                      </tr>
                                                                      <tr>
                                                                          <th style='border: 1px solid #dddddd; text-align: left; padding: 8px;'>Login:</th>
                                                                          <td style='border: 1px solid #dddddd; text-align: left; padding: 8px;'><a href='https://parceiro.laveai.app/auth/login/'>acesse a plataforma</a></td>
                                                                      </tr>
                                                                  </tbody>
                                                              </table>
                                                          </td>
                                                      </tr>
                                                      <tr>
                                                          <td align='center' class='esd-block-spacer es-p20' style='font-size:0'>
                                                              <table border='0' width='100%' height='100%' cellpadding='0' cellspacing='0'>
                                                                  <tbody>
                                                                      <tr>
                                                                          <td style='border-bottom: 1px solid #cccccc; background: unset; height:1px; width:100%; margin:0px 0px 0px 0px;'></td>
                                                                      </tr>
                                                                  </tbody>
                                                              </table>
                                                          </td>
                                                      </tr>
                                                  </tbody>
                                              </table>
                                          </td>
                                      </tr>
                                  </tbody>
                              </table>
                          </td>
                      </tr>
                  </tbody>
              </table>
          </td>"
        };
      }
      catch (Exception ex)
      {
        _logger.Error(ex, @$"[EmailTemplateService - FirstAccessPartner]: Error to generate FirstAccessPartner Template.");
        throw;
      }
    }

    public BaseTemplateReturn FirstAccessCollaborator(FirstAccessCollaborator firstAccessCollaborator)
    {
      try
      {
        return new BaseTemplateReturn() {
          Subject = $"PAM Platform - Primeiro Acesso - Colaborador",
          Body = @$"<td class='esd-stripe' align='center'>
              <table class='es-content-body' style='background-color: #ffffff;' width='600' cellspacing='0' cellpadding='0' bgcolor='#ffffff' align='center'>
                  <tbody>
                      <tr>
                          <td class='esd-structure es-p20t es-p20r es-p20l' align='left'>
                              <table cellpadding='0' cellspacing='0' width='100%'>
                                  <tbody>
                                      <tr>
                                          <td width='560' class='es-m-p0r esd-container-frame' valign='top' align='center'>
                                              <table cellpadding='0' cellspacing='0' width='100%'>
                                                  <tbody>
                                                      <tr>
                                                          <td align='center' class='esd-block-text'>
                                                              <p style='font-size: 45px;'><strong>PAM Platform</strong></p>
                                                          </td>
                                                      </tr>
                                                  </tbody>
                                              </table>
                                          </td>
                                      </tr>
                                  </tbody>
                              </table>
                          </td>
                      </tr>
                      <tr>
                          <td class='esd-structure es-p20' align='left'>
                              <table cellspacing='0' cellpadding='0' width='100%'>
                                  <tbody>
                                      <tr>
                                          <td width='560' align='left' class='esd-container-frame'>
                                              <table cellpadding='0' cellspacing='0' width='100%'>
                                                  <tbody>
                                                      <tr>
                                                          <td align='center' class='esd-block-image es-p20t es-p20b' style='font-size: 0px;'><a href='#'><img src='https://w7.pngwing.com/pngs/262/508/png-transparent-teplogidrostroy-password-manager-admin-icon-data-teplogidrostroy-system-thumbnail.png' alt style='display: block;' height='230'></a></td>
                                                      </tr>
                                                  </tbody>
                                              </table>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td class='es-m-p0r esd-container-frame' width='560' valign='top' align='center'>
                                              <table width='100%' cellspacing='0' cellpadding='0'>
                                                  <tbody>
                                                      <tr>
                                                          <td align='center' class='esd-block-text es-p20b'>
                                                              <h2 style='font-family: arial, 'helvetica neue', helvetica, sans-serif;'>Bem Vindo a PAM Plataform</h2>
                                                          </td>
                                                      </tr>
                                                      <tr>
                                                          <td align='left' class='esd-block-text es-p20t es-p15b'>
                                                              <p>Olá&nbsp;{firstAccessCollaborator.User_fullName},</p>
                                                              <p><br></p>
                                                              <p>Segue dados para seu primeiro login em nossa plataforma, assim que logar será solicitado que você insira uma nova senha e conclua o cadastro:</p>
                                                              <p><br></p>
                                                          </td>
                                                      </tr>
                                                      <tr>
                                                          <td align='center' class='esd-block-spacer es-p20' style='font-size:0'>
                                                              <table border='0' width='100%' height='100%' cellpadding='0' cellspacing='0'>
                                                                  <tbody>
                                                                      <tr>
                                                                          <td style='border-bottom: 1px solid #cccccc; background: unset; height:1px; width:100%; margin:0px 0px 0px 0px;'></td>
                                                                      </tr>
                                                                  </tbody>
                                                              </table>
                                                          </td>
                                                      </tr>
                                                      <tr>
                                                          <td class='esd-block-html esdev-disable-select'>
                                                              <table style='font-family: arial, sans-serif; border-collapse: collapse; width: 100%;'>
                                                                  <tbody>
                                                                      <tr>
                                                                          <th style='border: 1px solid #dddddd; text-align: left; padding: 8px;'>Email:</th>
                                                                          <td style='border: 1px solid #dddddd; text-align: left; padding: 8px;'>{firstAccessCollaborator.User_Email}</td>
                                                                      </tr>
                                                                      <tr>
                                                                          <th style='border: 1px solid #dddddd; text-align: left; padding: 8px;'>Senha:</th>
                                                                          <td style='border: 1px solid #dddddd; text-align: left; padding: 8px;'>{firstAccessCollaborator.GeneratedPassword}</td>
                                                                      </tr>
                                                                      <tr>
                                                                          <th style='border: 1px solid #dddddd; text-align: left; padding: 8px;'>Login:</th>
                                                                          <td style='border: 1px solid #dddddd; text-align: left; padding: 8px;'><a href='{firstAccessCollaborator.Link_portal}'>acesse a plataforma</a></td>
                            
                                                                      </tr>
                                                                  </tbody>
                                                              </table>
                                                          </td>
                                                      </tr>
                                                      <tr>
                                                          <td align='center' class='esd-block-spacer es-p20' style='font-size:0'>
                                                              <table border='0' width='100%' height='100%' cellpadding='0' cellspacing='0'>
                                                                  <tbody>
                                                                      <tr>
                                                                          <td style='border-bottom: 1px solid #cccccc; background: unset; height:1px; width:100%; margin:0px 0px 0px 0px;'></td>
                                                                      </tr>
                                                                  </tbody>
                                                              </table>
                                                          </td>
                                                      </tr>
                                                  </tbody>
                                              </table>
                                          </td>
                                      </tr>
                                  </tbody>
                              </table>
                          </td>
                      </tr>
                  </tbody>
              </table>
          </td>"
        };
      }
      catch (Exception ex)
      {
        _logger.Error(ex, @$"[EmailTemplateService - FirstAccessCollaborator]: Error to generate FirstAccessPartner Template.");
        throw;
      }
    }
  }
}
