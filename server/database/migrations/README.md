# Sequelize Migrations

This folder contains database migration files for Sequelize.

## Usage

### Create a new migration
```bash
npm run migrate:create migration-name
```

### Run migrations
```bash
npm run migrate
```

### Undo last migration
```bash
npm run migrate:undo
```

### Undo all migrations
```bash
npm run migrate:undo:all
```

### Check migration status
```bash
npm run migrate:status
```

## Migration File Structure

Example migration file:
```javascript
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('table_name', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // ... other columns
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('table_name');
  }
};
```
