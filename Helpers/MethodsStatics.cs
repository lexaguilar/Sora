using System;
using System.Security.Cryptography;
using System.Text;

namespace Sora
{
    static public class UserHelpers
    {
        // static public string GetPasswordHashed(this string pass)
        // {
        //     string hashPassword = "";
        //     using (MD5 md5Hash = MD5.Create())
        //     {
        //         hashPassword = GetMd5Hash(md5Hash, pass);
        //     }
        //     return hashPassword;
        // }

        static public string GetPasswordHashedSHA256(this string pass)
        {

            SHA256 sha256 = SHA256Managed.Create();
            ASCIIEncoding encoding = new ASCIIEncoding();
            byte[] stream = null;
            StringBuilder sBuilder = new StringBuilder();
            stream = sha256.ComputeHash(encoding.GetBytes(pass));
            for(int i =0; i < stream.Length;i++)
                sBuilder.AppendFormat("0:x2",stream[i]);
            return sBuilder.ToString();

        }

        
        // private static string GetMd5Hash(MD5 md5Hash, string input)
        // {
        //     byte[] data = md5Hash.ComputeHash(Encoding.UTF8.GetBytes(input));

        //     StringBuilder sBuilder = new StringBuilder();

        //     for (int i = 0; i < data.Length; i++)
        //     {
        //         sBuilder.Append(data[i].ToString("x2"));
        //     }
        //     return sBuilder.ToString();
        // }

        // private static bool VerifyMd5Hash(MD5 md5Hash, string input, string hash)
        // {

        //     string hashOfInput = GetMd5Hash(md5Hash, input);

        //     StringComparer comparer = StringComparer.OrdinalIgnoreCase;

        //     if (0 == comparer.Compare(hashOfInput, hash))
        //         return true;

        //     else
        //         return false;


        // }        
    
    }
}