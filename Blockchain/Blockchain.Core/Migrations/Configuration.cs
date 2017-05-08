namespace Blockchain.Core.Migrations
{
    using Blockchain.Core.Dal.Entities;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<Blockchain.Core.Dal.EntityContext.BlockchainContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(Blockchain.Core.Dal.EntityContext.BlockchainContext context)
        {
            //  This method will be called after migrating to the latest version.

            var areas = context.Areas.ToList();

            if (areas.Count == 0)
            {
                context.Areas.Add(new Areas
                {
                    AreaName = "Talent"
                });
                context.Areas.Add(new Areas
                {
                    AreaName = "Deloitte Consulting"
                });
                context.Areas.Add(new Areas
                {
                    AreaName = "US Innovation"
                });

                context.SaveChanges();
            }

            var offices = context.Offices.ToList();

            //if (offices.Count == 0)
            {
                context.Offices.Add(new Offices
                {
                    OfficeName = "Parsippany, NJ"
                });
                context.Offices.Add(new Offices
                {
                    OfficeName = "New York, NY"
                });
                context.Offices.Add(new Offices
                {
                    OfficeName = "Philadelphia, PA"
                });

                context.Offices.Add(new Offices
                {
                    OfficeName = "Chicago, IL"
                });
                context.Offices.Add(new Offices
                {
                    OfficeName = "Atlanta, GA"
                });

                context.Offices.Add(new Offices
                {
                    OfficeName = "Boston, MA"
                });

                context.Offices.Add(new Offices
                {
                    OfficeName = "sgr"
                });

                context.SaveChanges();

                context.Appusers.AddOrUpdate(new AppUsers { AUFirstName = "Test", AULastName = "User 1", AUUserClass = 1 });
                context.Appusers.Add(new AppUsers { AUFirstName = "Test", AULastName = "User 2", AUUserClass = 1 });
                context.Appusers.Add(new AppUsers { AUFirstName = "Test", AULastName = "User 3", AUUserClass = 1 });

               // context.Events.Add(new Events { EventName = "3 Day conference Last Week", CreatedBy });



            }
        }
    }
}
