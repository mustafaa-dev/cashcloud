import { MigrationInterface, QueryRunner } from 'typeorm';

export class Seed1705923597786 implements MigrationInterface {
  name = 'Seed1705923597786';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO roles (name) VALUES ('admin'),('moderator'),('client'),('supervisor'),('cashier')`,
    );
    // await queryRunner.query(
    //   `CREATE TABLE \`admin\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`userName\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`active\` tinyint NOT NULL DEFAULT 1, \`picture\` varchar(255) NOT NULL DEFAULT 'https://res.cloudinary.com/dp2f96bxe/image/upload/v1690846327/user_vrv06i.png', \`isSuperAdmin\` tinyint NOT NULL, \`roleId\` int NULL, UNIQUE INDEX \`IDX_de87485f6489f5d0995f584195\` (\`email\`), UNIQUE INDEX \`IDX_d83947f7a3425e6b4c8598ad60\` (\`userName\`), UNIQUE INDEX \`IDX_605f773f0197434dd12ab65277\` (\`phone\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    // );
    // await queryRunner.query(
    //   `CREATE TABLE \`client\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`userName\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`active\` tinyint NOT NULL DEFAULT 1, \`picture\` varchar(255) NOT NULL DEFAULT 'https://res.cloudinary.com/dp2f96bxe/image/upload/v1690846327/user_vrv06i.png', \`licenseId\` int NULL, \`roleId\` int NULL, UNIQUE INDEX \`IDX_6436cc6b79593760b9ef921ef1\` (\`email\`), UNIQUE INDEX \`IDX_0cc2d0b096a06409b80d5c2542\` (\`userName\`), UNIQUE INDEX \`IDX_368ca99acdbd5502fc08b3f779\` (\`phone\`), UNIQUE INDEX \`REL_8b53d29c6a795321de1a7fb634\` (\`licenseId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    // );
    // await queryRunner.query(
    //   `CREATE TABLE \`license\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`code\` int NOT NULL, \`active\` tinyint NOT NULL, \`expiration\` datetime NOT NULL, \`noOfStores\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    // );
    // await queryRunner.query(
    //   `CREATE TABLE \`employee\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`userName\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`active\` tinyint NOT NULL DEFAULT 1, \`picture\` varchar(255) NOT NULL DEFAULT 'https://res.cloudinary.com/dp2f96bxe/image/upload/v1690846327/user_vrv06i.png', \`shift\` tinyint NOT NULL DEFAULT 0, \`startShift\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`endShift\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`licenseId\` int NULL, \`roleId\` int NULL, UNIQUE INDEX \`IDX_817d1d427138772d47eca04885\` (\`email\`), UNIQUE INDEX \`IDX_b675a0d84e41877487abfe7d5d\` (\`userName\`), UNIQUE INDEX \`IDX_81afb288b526f7e8fed0e4200c\` (\`phone\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    // );
    // await queryRunner.query(
    //   `CREATE TABLE \`roles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    // );
    // await queryRunner.query(
    //   `ALTER TABLE \`admin\` ADD CONSTRAINT \`FK_446fb0cc55eed0065ececcc889b\` FOREIGN KEY (\`roleId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    // );
    // await queryRunner.query(
    //   `ALTER TABLE \`client\` ADD CONSTRAINT \`FK_8b53d29c6a795321de1a7fb6347\` FOREIGN KEY (\`licenseId\`) REFERENCES \`license\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    // );
    // await queryRunner.query(
    //   `ALTER TABLE \`client\` ADD CONSTRAINT \`FK_596dadf4ff5b01bd50869c57993\` FOREIGN KEY (\`roleId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    // );
    // await queryRunner.query(
    //   `ALTER TABLE \`employee\` ADD CONSTRAINT \`FK_2c26e902d05669e32e95679ad58\` FOREIGN KEY (\`licenseId\`) REFERENCES \`license\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    // );
    // await queryRunner.query(
    //   `ALTER TABLE \`employee\` ADD CONSTRAINT \`FK_646b91cc56d9fd9760973b4980d\` FOREIGN KEY (\`roleId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    // );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
