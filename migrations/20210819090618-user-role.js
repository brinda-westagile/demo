'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async t => {
      await queryInterface.addColumn('Users', 'roleID', {
        type: Sequelize.INTEGER
      }, { transaction: t }),
      await queryInterface.addConstraint('Users', {
        fields: ['roleID'],
        type: 'foreign key',
        name: 'FK_Race_Roles_roleID',
        references: {
          table: 'Roles',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      }, { transaction: t })
    });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Users', 'roleID')
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
