namespace Blockchain.Core.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Location : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.ActivityList", "Location", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.ActivityList", "Location");
        }
    }
}
