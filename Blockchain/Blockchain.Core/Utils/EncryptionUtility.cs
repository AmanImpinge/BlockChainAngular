using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Blockchain.Core.Utils
{
    public class EncryptionUtility
    {
        private const CipherMode cipherMode = CipherMode.CBC;
        //private const PaddingMode paddingMode = PaddingMode.ISO10126;
        private const PaddingMode paddingMode = PaddingMode.ISO10126;
        private const string defaultVector = "fdsah123456789";
        private const int iterations = 2;

        public static string CreateSalt()
        {
            //Generate a cryptographic random number.
            RNGCryptoServiceProvider rng = new RNGCryptoServiceProvider();
            byte[] buff = new byte[20];
            rng.GetBytes(buff);

            // Return a Base64 string representation of the random number.
            return Convert.ToBase64String(buff);
        }

        public static string Encrypt(string plainText, string passphrase)
        {
            byte[] clearData = Encoding.Unicode.GetBytes(plainText);
            byte[] encryptedData;
            var crypt = GetCrypto(passphrase);
            using (var ms = new MemoryStream())
            {
                using (var cs = new CryptoStream(ms, crypt.CreateEncryptor(), CryptoStreamMode.Write))
                {
                    cs.Write(clearData, 0, clearData.Length);
                    //cs.FlushFinalBlock(); //Have tried this active and commented with no change.
                }
                encryptedData = ms.ToArray();
            }
            //Changed per Xint0's answer.
            return Convert.ToBase64String(encryptedData);
        }

        public static string Decrypt(string cipherText, string passphrase)
        {
            //Changed per Xint0's answer.
            if (!String.IsNullOrEmpty(cipherText))
            {
                byte[] encryptedData = Convert.FromBase64String(cipherText);
                byte[] clearData;
                var crypt = GetCrypto(passphrase);
                using (var ms = new MemoryStream())
                {
                    using (var cs = new CryptoStream(ms, crypt.CreateDecryptor(), CryptoStreamMode.Write))
                    {
                        cs.Write(encryptedData, 0, encryptedData.Length);
                        //I have tried adding a cs.FlushFinalBlock(); here as well.
                    }
                    clearData = ms.ToArray();
                }
                return Encoding.Unicode.GetString(clearData);
            }
            else
            {
                return null;
            }
        }

        private static Rijndael GetCrypto(string passphrase)
        {
            var crypt = Rijndael.Create();
            crypt.Mode = cipherMode;
            crypt.Padding = paddingMode;
            crypt.BlockSize = 256;
            crypt.KeySize = 256;
            crypt.Key =
                new Rfc2898DeriveBytes(passphrase, Encoding.Unicode.GetBytes(defaultVector), iterations).GetBytes(32);
            crypt.IV = new Rfc2898DeriveBytes(passphrase, Encoding.Unicode.GetBytes(defaultVector), iterations).GetBytes(32);
            return crypt;
        }

        /// <summary> 
        /// Hash enum value 
        /// </summary> 
        public enum HashName
        {
            SHA1 = 1,
            MD5 = 2,
            SHA256 = 4,
            SHA384 = 8,
            SHA512 = 16
        }

        /// <summary> 
        /// Compute Hash 
        /// </summary> 
        /// <param name="plainText">plain text</param> 
        /// <param name="salt">salt string</param> 
        /// <returns>string</returns> 
        public static string ComputeHash(string plainText, string salt)
        {
            return ComputeHash(plainText, salt, HashName.SHA256);
        }

        /// <summary> 
        /// Compute Hash 
        /// </summary> 
        /// <param name="plainText">plain text</param> 
        /// <param name="salt">salt string</param> 
        /// <param name="hashName">Hash Name</param> 
        /// <returns>string</returns> 
        public static string ComputeHash(string plainText, string salt, HashName hashName)
        {
            if (!string.IsNullOrEmpty(plainText))
            {
                // Convert plain text into a byte array. 
                byte[] plainTextBytes = ASCIIEncoding.ASCII.GetBytes(plainText);
                // Allocate array, which will hold plain text and salt. 
                byte[] plainTextWithSaltBytes = null;
                byte[] saltBytes;
                if (!string.IsNullOrEmpty(salt))
                {
                    // Convert salt text into a byte array. 
                    saltBytes = ASCIIEncoding.ASCII.GetBytes(salt);
                    plainTextWithSaltBytes =
                        new byte[plainTextBytes.Length + saltBytes.Length];
                }
                else
                {
                    // Define min and max salt sizes. 
                    int minSaltSize = 4;
                    int maxSaltSize = 8;
                    // Generate a random number for the size of the salt. 
                    Random random = new Random();
                    int saltSize = random.Next(minSaltSize, maxSaltSize);
                    // Allocate a byte array, which will hold the salt. 
                    saltBytes = new byte[saltSize];
                    // Initialize a random number generator. 
                    RNGCryptoServiceProvider rngCryptoServiceProvider =
                                new RNGCryptoServiceProvider();
                    // Fill the salt with cryptographically strong byte values. 
                    rngCryptoServiceProvider.GetNonZeroBytes(saltBytes);
                }
                // Copy plain text bytes into resulting array. 
                for (int i = 0; i < plainTextBytes.Length; i++)
                {
                    plainTextWithSaltBytes[i] = plainTextBytes[i];
                }
                // Append salt bytes to the resulting array. 
                for (int i = 0; i < saltBytes.Length; i++)
                {
                    plainTextWithSaltBytes[plainTextBytes.Length + i] =
                                        saltBytes[i];
                }
                HashAlgorithm hash = null;
                switch (hashName)
                {
                    case HashName.SHA1:
                        hash = new SHA1Managed();
                        break;
                    case HashName.SHA256:
                        hash = new SHA256Managed();
                        break;
                    case HashName.SHA384:
                        hash = new SHA384Managed();
                        break;
                    case HashName.SHA512:
                        hash = new SHA512Managed();
                        break;
                    case HashName.MD5:
                        hash = new MD5CryptoServiceProvider();
                        break;
                }
                // Compute hash value of our plain text with appended salt. 
                byte[] hashBytes = hash.ComputeHash(plainTextWithSaltBytes);
                // Create array which will hold hash and original salt bytes. 
                byte[] hashWithSaltBytes =
                    new byte[hashBytes.Length + saltBytes.Length];
                // Copy hash bytes into resulting array. 
                for (int i = 0; i < hashBytes.Length; i++)
                {
                    hashWithSaltBytes[i] = hashBytes[i];
                }
                // Append salt bytes to the result. 
                for (int i = 0; i < saltBytes.Length; i++)
                {
                    hashWithSaltBytes[hashBytes.Length + i] = saltBytes[i];
                }
                // Convert result into a base64-encoded string. 
                string hashValue = Convert.ToBase64String(hashWithSaltBytes);
                // Return the result. 
                return hashValue;
            }
            return string.Empty;
        } 
    }
}
