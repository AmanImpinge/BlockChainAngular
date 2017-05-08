using Blockchain.Core.Constants;
using Blockchain.Core.Models;
using Gma.QrCodeNet.Encoding;
using Gma.QrCodeNet.Encoding.Windows.Render;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Blockchain.Core.Utils
{
    public class AppUtils
    {
        private static string _token;
        private static string _baseUri;

        /// <summary>
        /// To send an email
        /// </summary>
        /// <param name="mailInfo">mail info object. It contains recipient info and email body, subject etc.</param>
        /// <returns></returns>
        public static async Task SendEmail(MailInfo mailInfo)
        {
            MailMessage mail = new MailMessage();
            mail.To.Add(mailInfo.ToAddress);
            mail.Subject = mailInfo.Subject;
            mail.Body = mailInfo.Body;
            mail.IsBodyHtml = mailInfo.IsBodyHtml;
            SmtpClient smtp = new SmtpClient();
            await smtp.SendMailAsync(mail);
        }

        /// <summary>
        /// To generate random string. You can use this method for generate radom strings.
        /// </summary>
        /// <param name="length">lenth of string to generate</param>
        /// <returns>string value</returns>
        public static string RandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        /// <summary>
        /// Method to get QR code image data from the unique string
        /// </summary>
        /// <param name="generateFrom">unique string to generate qr code</param>
        /// <returns>QRCode</returns>
        public static QRCode GenerateQrCode(string generateFrom)
        {
            QrEncoder qrEncoder = new QrEncoder(ErrorCorrectionLevel.H);
            QrCode qrCode = qrEncoder.Encode(generateFrom);

            GraphicsRenderer renderer = new GraphicsRenderer(new FixedModuleSize(5, QuietZoneModules.Two), Brushes.Black, Brushes.White);
            string imageName = string.Format("QrCode_{0}.png", AppUtils.RandomString(8));
            string serverQrCodePath = HttpContext.Current.Server.MapPath(string.Format("~/{0}", imageName));

            using (FileStream stream = new FileStream(serverQrCodePath, FileMode.Create))
            {
                renderer.WriteToStream(qrCode.Matrix, ImageFormat.Png, stream);
            }
            string image64String;

            byte[] bytes1 = File.ReadAllBytes(serverQrCodePath);
            image64String = Convert.ToBase64String(bytes1);

            QRCode userQRCode = new QRCode
            {
                Data = bytes1,
                MimeType = "images/png",
                ImageBase64String = image64String
            };

            File.Delete(serverQrCodePath);

            return userQRCode;
        }

        /// <summary>
        /// To make get request to third party apis.
        /// </summary>
        /// <typeparam name="T">A generic type parameter</typeparam>
        /// <param name="relativeUrl">url of api</param>
        /// <param name="queryStringParams">query string parameters of request</param>
        /// <param name="headers">headers of request</param>
        /// <returns>GenericResponse<T></returns>
        public static async Task<GenericResponse<T>> MakeGetRequestAsync<T>(string relativeUrl, Dictionary<string, object> queryStringParams = null,
       Dictionary<string, string> headers = null) where T : class
        {
            _baseUri = ConfigurationManager.AppSettings["LoyyalApiUrl"];
            var result = new GenericResponse<T>();
            var client = new HttpClient();

            var apiAddress = _baseUri + relativeUrl;
            var url = GetQueryString(apiAddress, queryStringParams);
            var request = new HttpRequestMessage(HttpMethod.Get, url);

            AddHeaders(request, headers);

            if (!string.IsNullOrEmpty(_token))
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _token);
            }

            var response = await client.SendAsync(request);
            if (response.StatusCode == HttpStatusCode.OK)
            {
                result.Data = await response.Content.ReadAsAsync<T>();
                result.Status = Messages.Ok;
            }
            else
            {
                result.Status = Messages.Fail;
                result.Error = new Error { Message = response.ReasonPhrase, ErrorCode = Convert.ToInt32(response.StatusCode) };
            }

            return result;
        }

        /// <summary>
        /// To make Put, Post, Delete request to third party apis.
        /// </summary>
        /// <typeparam name="T">A generic type parameter</typeparam>
        /// <param name="method">method type(Put, Post, Delete etc.)</param>
        /// <param name="content">data to post</param>
        /// <param name="relativeUrl">url of api</param>
        /// <param name="queryStringParams">query string parameters of request</param>
        /// <param name="headers">headers of request</param>
        /// <param name="contentType">content type of request.</param>
        /// <param name="formUrlEncodedData">data to send in the form of form-data</param>
        /// <returns>GenericResponse<T></returns>
        public static async Task<GenericResponse<T>> MakePostOrPutRequestAsync<T>(HttpMethod method, object content, string relativeUrl,
            Dictionary<string, object> queryStringParams = null,
            Dictionary<string, string> headers = null, string contentType = null, string formUrlEncodedData = null) where T : class
        {
            _baseUri = ConfigurationManager.AppSettings["LoyyalApiUrl"];
            var result = new GenericResponse<T>();
            var client = new HttpClient();

            var apiAddress = _baseUri + relativeUrl;
            var url = GetQueryString(apiAddress, queryStringParams);
            var request = new HttpRequestMessage(method, url);

            AddHeaders(request, headers);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _token);

            if (content != null)
            {
                contentType = !string.IsNullOrEmpty(contentType) ? contentType : "application/json";

                if (!string.IsNullOrEmpty(formUrlEncodedData))
                {
                    request.Content = new StringContent(formUrlEncodedData, Encoding.UTF8, contentType);
                }
                else
                {
                    request.Content = new StringContent(JsonConvert.SerializeObject(content), Encoding.UTF8,
                  contentType);
                }
            }

            var response = await client.SendAsync(request);
            if (response.StatusCode == HttpStatusCode.OK)
            {
                result.Data = await response.Content.ReadAsAsync<T>();
                result.Status = Messages.Ok;
            }
            else
            {
                //var message = await response.Content.ReadAsStringAsync();
                result.Status = Messages.Fail;
                result.Error = new Error { Message = response.ReasonPhrase, ErrorCode = Convert.ToInt32(response.StatusCode) };
            }

            return result;
        }

        private static string GetQueryString(string uri, Dictionary<string, object> queryStringParams)
        {
            if (queryStringParams == null)
            {
                return uri;
            }

            if (!uri.EndsWith("?"))
            {
                uri = uri + "?";
            }

            List<string> uriParams = new List<string>();
            foreach (var queryString in queryStringParams)
            {
                uriParams.Add(string.Format("{0}={1}", queryString.Key, queryString.Value));
            }

            return uri + string.Join("&", uriParams);
        }

        private static void AddHeaders(HttpRequestMessage request, Dictionary<string, string> headers)
        {
            if (headers == null || !headers.Any()) return;

            foreach (var header in headers)
            {
                request.Headers.Add(header.Key, header.Value);
            }
        }
    }
}
