using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blockchain.Core.Dal.EntityContext
{
    public class CompanyInitializer : CreateDatabaseIfNotExists<BlockchainContext>
    {
        protected override void Seed(BlockchainContext context)
        {
            //var UserData = new List<AppUsers>
            //{
            //   new AppUsers{ }
            //};
            //foreach (var item in UserData)
            //{
            //    context.Appusers.Add(item);
            //}
            //context.SaveChanges();
        }
    }
}
