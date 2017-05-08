namespace Blockchain.Core.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ASEmployeeID1 : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.AppSpecificData", "ASPhotoID", c => c.String(nullable: false, maxLength: 32, unicode: false));
            AlterColumn("dbo.AppSpecificData", "ASTwitterID", c => c.String(nullable: false, maxLength: 36, unicode: false));
            AlterColumn("dbo.AppSpecificData", "ASLinkedInID", c => c.String(nullable: false, maxLength: 36, unicode: false));
            AlterColumn("dbo.AppSpecificData", "ASInstagramID", c => c.String(nullable: false, maxLength: 36, unicode: false));
            AlterColumn("dbo.AppSpecificData", "ASSkypeID", c => c.String(nullable: false, maxLength: 36, unicode: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.AppSpecificData", "ASSkypeID", c => c.String(maxLength: 36, unicode: false));
            AlterColumn("dbo.AppSpecificData", "ASInstagramID", c => c.String(maxLength: 36, unicode: false));
            AlterColumn("dbo.AppSpecificData", "ASLinkedInID", c => c.String(maxLength: 36, unicode: false));
            AlterColumn("dbo.AppSpecificData", "ASTwitterID", c => c.String(maxLength: 36, unicode: false));
            AlterColumn("dbo.AppSpecificData", "ASPhotoID", c => c.String(maxLength: 32, unicode: false));
        }
    }
}
