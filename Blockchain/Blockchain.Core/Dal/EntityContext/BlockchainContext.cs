using Blockchain.Core.Dal.Entities;
using Blockchain.Core.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blockchain.Core.Dal.EntityContext
{
    public class BlockchainContext : DbContext
    {
        public DbSet<AppUsers> Appusers { get; set; }
        public DbSet<AppUserDetails> AppUserDetails { get; set; }
        public DbSet<AppSpecificData> AppSpecificData { get; set; }
        public DbSet<UserPrefs> UserPrefs { get; set; }
        public DbSet<Devices> Devices { get; set; }
        public DbSet<AppleProductIDs> AppleProductIDs { get; set; }
        public DbSet<InAppPurchases> InAppPurchases { get; set; }
        public DbSet<ItemCatalog> ItemCatalogs { get; set; }
        public DbSet<BadgeList> BadgeList { get; set; }
        public DbSet<BadgesEarned> BadgesEarned { get; set; }
        public DbSet<ActivityList> ActivityList { get; set; }
        public DbSet<ActivitiesCompleted> ActivitiesCompleted { get; set; }
        public DbSet<NewsFeed> NewsFeed { get; set; }
        public DbSet<SysMsgs> SysMsgs { get; set; }
        public DbSet<UserLogins> UserLogins { get; set; }
        public DbSet<World> Worlds { get; set; }
        public DbSet<Transactions> Transactions { get; set; }
        public DbSet<PrivacyNotes> PrivacyNotes { get; set; }
        public DbSet<FAQs> FAQs { get; set; }
        public DbSet<Events> Events { get; set; }
        public DbSet<Areas> Areas { get; set; }
        public DbSet<Offices> Offices { get; set; }
        //public DbSet<poco> pocoObj { get; set; }
        //public DbSet<poco> pocoObj { get; set; }


        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }
    }
}
