var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var User = mongoose.model('User');
var Token = mongoose.model('Token');
var auth = require('../auth');

router.get('/user', auth.required, function (req, res, next) {
    User.findById(req.payload.id).then(function (user) {
        if (!user)
            return res.sendStatus(401);
        return res.json({ user: user.toAuthJSON() });
    }).catch(next);
});

router.put('/user', auth.required, function (req, res, next) {
    User.findById(req.payload.id).then(function (user) {
        if (!user)
            return res.sendStatus(401)

        if (typeof req.body.user.username !== 'undefined') {
            user.username = req.body.user.username;
        }
        if (typeof req.body.user.email !== 'undefined') {
            user.email = req.body.user.email;
        }
        if (typeof req.body.user.bio !== 'undefined') {
            user.bio = req.body.user.bio;
        }
        if (typeof req.body.user.image !== 'undefined') {
            user.image = req.body.user.image;
        }
        if (typeof req.body.user.password !== 'undefined') {
            user.setPassword(req.body.user.password);
        }

        return user.save().then(function () {
            return res.json({ user: user.toAuthJSON() });
        }).catch(next)

    }).catch(next);

})

router.post('/users', function (req, res, next) {
    var user = new User();
    user.username = req.body.user.username;
    user.email = req.body.user.email;
    user.setPassword(req.body.user.password);

    user.save().then(function (user) {

        var token = new Token();
        token._userId = user._id;
        token.setToken(user);
        token.save().then(function (token) {
            console.log(token);
        })

        sendTokenToUser(token);
        res.sendStatus(204);
    }).catch(next);
});

var sendTokenToUser = function (token) {
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    console.log(process.env.SENDGRID_API_KEY);
    
    const msg = { 
        to: 'hamzatanjicherkaoui@gmail.com',
        from: 'counduit2@helloworld.com',
        subject: `Verify your Account `,
        
        html: `
        <!doctype html>
        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
        xmlns:o="urn:schemas-microsoft-com:office:office">
          
          <head>
            <title></title>
            <!--[if !mso]>
              <!-- -->
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <!--<![endif]-->
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style type="text/css">
              #outlook a { padding: 0; }
              .ReadMsgBody { width: 100%; }
              .ExternalClass { width: 100%; }
              .ExternalClass * { line-height:100%; }
              body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
              table, td { border-collapse:collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
              img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
              p { display: block; margin: 13px 0; }
            </style>
            <!--[if !mso]>
              <!-->
              <style type="text/css">
                @media only screen and (max-width:480px) {
                  @-ms-viewport { width:320px; }
                  @viewport { width:320px; }
                }
              </style>
            <!--<![endif]-->
            <!--[if mso]>
              <xml>
                <o:OfficeDocumentSettings>
                  <o:AllowPNG/>
                  <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
              </xml>
            <![endif]-->
            <!--[if lte mso 11]>
              <style type="text/css">
                .outlook-group-fix {
                  width:100% !important;
                }
              </style>
            <![endif]-->
            <!--[if !mso]>
              <!-->
              <link href="https://d2yjfm58htokf8.cloudfront.net/static/fonts/averta-v2.css"
              rel="stylesheet" type="text/css">
              <style type="text/css">
                @import url(https://d2yjfm58htokf8.cloudfront.net/static/fonts/averta-v2.css);
              </style>
            <!--<![endif]-->
            <style type="text/css">
              p {
                margin: 0 0 24px 0;
              }
        
              a {
                color: #00b9ff;
              }
        
              hr {
                margin: 32px 0;
                border-top: 1px #e2e6e8;
              }
        
              dt {
                font-size: 13px;
                margin-left: 0;
              }
        
              dd {
                color: #37517e;
                margin-bottom: 24px;
                margin-left: 0;
              }
        
              h5 {
                font-family: TW-Averta-SemiBold, Averta, Helvetica, Arial;
                font-size: 16px;
                line-height: 24px;
                color: #2e4369;
              }
              
              pre {
                display: block;
                padding: 16px;
                padding: 12px 24px;
                margin: 0 0 48px;
                font-size: 14px;
                line-height: 24px;
                color: #4a5860;
                word-break: break-all;
                word-wrap: break-word;
                background-color: #f2f5f7;
                border-radius: 3px;
              }
        
              .body-wrapper {
                background: #f2f5f7 url('https://d2yjfm58htokf8.cloudfront.net/static/images/background-v1.png') no-repeat center top;
                padding: 0px;
                margin: auto;
              }
        
              .content-wrapper {
                max-width: 536px;
                padding: 32px;
                padding-bottom: 48px;
              }
        
              .footer-wrapper div {
                color: #37517e !important;
              }
        
              .footer-wrapper div a {
                color: #00b9ff !important;
              }
        
              .hero {
                font-family: TW-Averta-Bold, Averta, Helvetica, Arial;
                color: #37517e;
                font-size: 22px;
                line-height: 30px;
              }
        
              .page-header {
                border-bottom: 1px solid #eaebed;
                padding-bottom: 16px;
              }
        
              .mb-0 {
                margin-bottom: 0 !important;
              }
        
              .mt-0 {
                margin-top: 0 !important;
              }
              
              .btn {
                box-sizing: border-box;
                display: inline-block;
                min-height: 36px;
                padding: 12px 24px;
                margin: 0 0 24px;
                font-size: 16px;
                font-weight: 600;
                line-height: 24px;
                text-align: center;
                white-space: nowrap;
                vertical-align: middle;
                cursor: pointer;
                border: 0;
                border-radius: 3px;
                color: #fff;
                background-color: #00b9ff;
                text-decoration: none;
        
                -webkit-transition: all .15s ease-in-out;
                -o-transition: all .15s ease-in-out;
                transition: all .15s ease-in-out;
              }
              
              .btn:hover {
                background-color: #00a4df;
              }
              
              .btn:active {
                background-color: #008ec0;
              }
        
              @media screen and (min-width: 576px) and (max-width: 768px) {
                .body-wrapper {
                  padding: 24px !important;
                }
        
                .content-wrapper {
                  max-width: 504px !important;
                  padding: 48px !important;
                }
              }
        
              @media screen and (min-width: 768px) {
                .body-wrapper {
                  padding: 48px !important;
                }
        
                .content-wrapper {
                  max-width: 456px !important;
                  padding: 72px !important;
                  padding-top: 48px !important;
                }
              }
            </style>
            <style type="text/css">
              @media only screen and (min-width:480px) {
                .mj-column-per-100 { width:100%!important; }
              }
            </style>
          </head>
          
          <body>
            <div class="mj-container body-wrapper">
              <!--[if mso | IE]>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600"
                align="center" style="width:600px;">
                  <tr>
                    <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                    <![endif]-->
                    <div style="margin:0px auto;max-width:600px;background:#fff;" class="content-wrapper"
                    data-class="content-wrapper">
                      <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:#fff;"
                      align="center" border="0">
                        <tbody>
                          <tr>
                            <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px;">
                              <!--[if mso | IE]>
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                  <tr>
                                    <td style="width:600px;">
                                    <![endif]-->
                                    <div style="margin:0px auto;max-width:600px;">
                                      <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;"
                                      align="center" border="0">
                                        <tbody>
                                          <tr>
                                            <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px;">
                                              <!--[if mso | IE]>
                                                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                                  <tr>
                                                    <td style="vertical-align:middle;width:600px;">
                                                    <![endif]-->
                                                    <div class="mj-column-per-100 outlook-group-fix" style="vertical-align:middle;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                                      <table role="presentation" cellpadding="0" cellspacing="0" style="vertical-align:middle;"
                                                      width="100%" border="0">
                                                        <tbody>
                                                          <tr>
                                                            <td style="word-wrap:break-word;font-size:0px;padding:0px;" align="center">
                                                              <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px;"
                                                              align="center" border="0">
                                                                <tbody>
                                                                  <tr>
                                                                    <td style="width:150px;">
                                                                     
                                                                    </td>
                                                                  </tr>
                                                                </tbody>
                                                              </table>
                                                            </td>
                                                          </tr>
                                                        </tbody>
                                                      </table>
                                                    </div>
                                                    <!--[if mso | IE]>
                                                    </td>
                                                  </tr>
                                                </table>
                                              <![endif]-->
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                    <!--[if mso | IE]>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style="width:600px;">
                                    <![endif]-->
                                    <div style="margin:0px auto;max-width:600px;">
                                      <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;"
                                      align="center" border="0">
                                        <tbody>
                                          <tr>
                                            <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px;">
                                              <!--[if mso | IE]>
                                                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                                  <tr>
                                                    <td style="vertical-align:top;width:600px;">
                                                    <![endif]-->
                                                    <div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                                      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                                        <tbody>
                                                          <tr>
                                                            <td style="word-wrap:break-word;font-size:0px;padding:0px;">
                                                              <div style="font-size:1px;line-height:48px;white-space:nowrap;"> </div>
                                                            </td>
                                                          </tr>
                                                        </tbody>
                                                      </table>
                                                    </div>
                                                    <!--[if mso | IE]>
                                                    </td>
                                                  </tr>
                                                </table>
                                              <![endif]-->
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                    <!--[if mso | IE]>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style="width:600px;">
                                    <![endif]-->
                                    <div style="margin:0px auto;max-width:600px;">
                                      <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;"
                                      align="center" border="0">
                                        <tbody>
                                          <tr>
                                            <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px;">
                                              <!--[if mso | IE]>
                                                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                                  <tr>
                                                    <td style="vertical-align:top;width:600px;">
                                                    <![endif]-->
                                                    <div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                                      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                                        <tbody>
                                                          <tr>
                                                            <td style="word-wrap:break-word;font-size:0px;padding:0px;" align="left">
                                                              <div style="cursor:auto;color:#5d7079;font-family:TW-Averta-Regular, Averta, Helvetica, Arial;font-size:16px;line-height:24px;letter-spacing:0.4px;text-align:left;">
                                                                <p>Hello,</p>
                                                                <p class="hero">It’s time to confirm your email address.</p>
                                                                <p>Have we got the right email address to reach you on? To confirm that you can get
                                                                  our emails, just click the button below.</p>
                                                                <p>
                                                                  <a href="http://localhost:3000/api/user/confirm?token=${token.token}" class="btn" mc:disable-tracking="">Confirm my email address</a>
                                                                </p>
                                                                <p>If you don’t know why you got this email, please tell us straight away so we can
                                                                  fix this for you.</p>
                                                                <hr style="margin-top: 56px">
                                                                <p class="mb-0">Thanks,</p>
                                                                <p class="mb-0">The TransferWise Team</p>
                                                              </div>
                                                            </td>
                                                          </tr>
                                                        </tbody>
                                                      </table>
                                                    </div>
                                                    <!--[if mso | IE]>
                                                    </td>
                                                  </tr>
                                                </table>
                                              <![endif]-->
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                    <!--[if mso | IE]>
                                    </td>
                                  </tr>
                                </table>
                              <![endif]-->
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <!--[if mso | IE]>
                    </td>
                  </tr>
                </table>
              <![endif]-->
              <!--[if mso | IE]>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600"
                align="center" style="width:600px;" class="content-wrapper-outlook footer-wrapper-outlook">
                  <tr>
                    <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                    <![endif]-->
                    <div style="margin:0px auto;max-width:600px;" class="content-wrapper footer-wrapper">
                      <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;"
                      align="center" border="0">
                        <tbody>
                          <tr>
                            <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px;">
                              <!--[if mso | IE]>
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                  <tr>
                                    <td style="width:600px;">
                                    <![endif]-->
                                    <div style="margin:0px auto;max-width:600px;">
                                      <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;"
                                      align="center" border="0">
                                        <tbody>
                                          <tr>
                                            <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px;">
                                              <!--[if mso | IE]>
                                                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                                  <tr>
                                                    <td style="vertical-align:top;width:600px;">
                                                    <![endif]-->
                                                    <div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                                      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                                        <tbody>
                                                          <tr>
                                                            <td style="word-wrap:break-word;font-size:0px;padding:0px;" align="center">
                                                              <div style="cursor:auto;color:#5d7079;font-family:TW-Averta-Regular, Averta, Helvetica, Arial;font-size:14px;line-height:24px;letter-spacing:0.4px;text-align:center;">You can find answers to common questions
                                                                <a href="https://api.transferwise.com/v1/notification-flow/messages/c6180a31-5cdb-477a-8c36-756232726efc/channels/EMAIL/linkClicks/?name=faq&link=aHR0cHM6Ly90cmFuc2Zlcndpc2UuY29tL2hlbHAv&hash=882b12943db0fa82ca9269fe0f229a28">here</a>. And you can always reach us at
                                                                <a href="mailto:support@transferwise.com">support@transferwise.com</a>.</div>
                                                            </td>
                                                          </tr>
                                                        </tbody>
                                                      </table>
                                                    </div>
                                                    <!--[if mso | IE]>
                                                    </td>
                                                  </tr>
                                                </table>
                                              <![endif]-->
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                    <!--[if mso | IE]>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style="width:600px;">
                                    <![endif]-->
                                    <div style="margin:0px auto;max-width:600px;">
                                      <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;"
                                      align="center" border="0">
                                        <tbody>
                                          <tr>
                                            <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px;">
                                              <!--[if mso | IE]>
                                                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                                  <tr>
                                                    <td style="vertical-align:top;width:600px;">
                                                    <![endif]-->
                                                    <div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                                      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                                        <tbody>
                                                          <tr>
                                                            <td style="word-wrap:break-word;font-size:0px;padding:0px;">
                                                              <div style="font-size:1px;line-height:24px;white-space:nowrap;"> </div>
                                                            </td>
                                                          </tr>
                                                        </tbody>
                                                      </table>
                                                    </div>
                                                    <!--[if mso | IE]>
                                                    </td>
                                                  </tr>
                                                </table>
                                              <![endif]-->
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                    <!--[if mso | IE]>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style="width:600px;">
                                    <![endif]-->
                                    <div style="margin:0px auto;max-width:600px;">
                                      <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;"
                                      align="center" border="0">
                                        <tbody>
                                          <tr>
                                            <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px;">
                                              <!--[if mso | IE]>
                                                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                                  <tr>
                                                    <td style="vertical-align:top;width:600px;">
                                                    <![endif]-->
                                                    <div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                                      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                                        <tbody>
                                                          <tr>
                                                            <td style="word-wrap:break-word;font-size:0px;padding:0px;" align="center">
                                                              <div style="cursor:auto;color:#5d7079;font-family:TW-Averta-Regular, Averta, Helvetica, Arial;font-size:14px;line-height:24px;letter-spacing:0.4px;text-align:center;">TransferWise Limited is a company registered in England and Wales with registered
                                                                number 07209813. Our registered office is at 56 Shoreditch High Street, London,
                                                                E1 6JJ. TransferWise is an Electronic Money Institution authorised by the Financial
                                                                Conduct Authority with firm reference 900507.</div>
                                                            </td>
                                                          </tr>
                                                        </tbody>
                                                      </table>
                                                    </div>
                                                    <!--[if mso | IE]>
                                                    </td>
                                                  </tr>
                                                </table>
                                              <![endif]-->
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                    <!--[if mso | IE]>
                                    </td>
                                  </tr>
                                </table>
                              <![endif]-->
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <!--[if mso | IE]>
                    </td>
                  </tr>
                </table>
              <![endif]-->
              <!--[if mso | IE]>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600"
                align="center" style="width:600px;">
                  <tr>
                    <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                    <![endif]-->
                    <div style="margin:0px auto;max-width:600px;background:transparent;">
                      <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:transparent;"
                      align="center" border="0">
                        <tbody>
                          <tr>
                            <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px;">
                              <!--[if mso | IE]>
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                  <tr>
                                    <td style="vertical-align:top;width:600px;">
                                    <![endif]-->
                                    <div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                        <tbody>
                                          <tr>
                                            <td style="word-wrap:break-word;font-size:0px;padding:0px;" align="center">
                                              <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px;"
                                              align="center" border="0">
                                                <tbody>
                                                  <tr>
                                                    <td style="width:1px;">
                                                      <img alt="" title="" height="1" src="https://api.transferwise.com/v1/notification-flow/messages/c6180a31-5cdb-477a-8c36-756232726efc/channels/EMAIL/open.gif"
                                                      style="border:none;border-radius:0px;display:block;font-size:13px;outline:none;text-decoration:none;width:100%;height:1px;"
                                                      width="1">
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                    <!--[if mso | IE]>
                                    </td>
                                  </tr>
                                </table>
                              <![endif]-->
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <!--[if mso | IE]>
                    </td>
                  </tr>
                </table>
              <![endif]-->
            </div>
          </body>
        
        </html>`,
    };
    sgMail.send(msg);

}
router.get('/user/confirm', function (req, res, next) {
    if (typeof req.query.token === 'undefined') res.sendStatus(403);
    var token = req.query.token;
    Token.findOne({ token: token }).then(function (token) {
        console.log(token);
        User.findById(token._userId).then(function (user) {
            if (!user)
                return res.sendStatus(401)
            user.isVerified = true;
            // token.remove().exec();

            user.save().then(function (user) {
                Token.findByIdAndRemove(token.id, (err, todo) => {
                    res.status(204).send({message : "verified succesfully"});
                                })

        }).catch(next)
    });

}).catch(next);
})
router.post('/user/resend', function (req, res, next) {
    if (typeof req.body.email === 'undefined') return res.status(422).json({ errors: { email: "can't be blank" } });
    User.findOne({ email: req.body.email }).then(function (user) {
        var token = new Token();
        token._userId = user._id;
        token.setToken(user);
        token.save().then(function (token) {
            console.log(token);
        })

        sendTokenToUser(token);
        res.sendStatus(204);
    })
})
router.post('/users/login', function (req, res, next) {
    User.count({ email: req.body.user.email, isVerified: true }).then(function (count) {
        if (count == 0) res.send("the account is not verified");
    })

    if (!req.body.user.email)
        return res.status(422).json({ erros: { email: "cant't be blank" } })
    if (!req.body.user.password)
        return res.status(422).json({ errors: { password: "can't be blank" } });

    passport.authenticate('local', { session: false }, function (err, user, info) {
        if (err)
            return next(err)
        if (user) {
            user.token = user.generateJWT();
            return res.json({ user: user.toAuthJSON() });
        } else {
            return res.status(422).json(info);
        }
    })(req, res, next);
});

module.exports = router;