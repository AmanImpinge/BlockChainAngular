namespace Blockchain.Core.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ASEmployeeID : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.AppSpecificData", "ASEmployeeID", c => c.String(nullable: false, maxLength: 36, unicode: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.AppSpecificData", "ASEmployeeID", c => c.String(maxLength: 36, unicode: false));
        }
    }
}
