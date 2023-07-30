const { DataTypes } = require('sequelize');
const UserModel = require('./userModel'); // Replace this with the correct path to your userModel file

// Mock the sequelize instance
const { mockSequelize, mockDataTypes } = require('sequelize-mock');
const sequelize = mockSequelize();
const DataTypesMock = mockDataTypes(DataTypes);

describe('User Model', () => {
  const User = UserModel(sequelize, DataTypesMock);

  test('should have the expected model name', () => {
    expect(User.name).toBe('user');
  });

  test('should have a userName field of type STRING', () => {
    expect(User.rawAttributes.userName.type).toBe(DataTypes.STRING);
    expect(User.rawAttributes.userName.allowNull).toBe(false);
  });

  test('should have an email field of type STRING with unique and allowNull properties', () => {
    expect(User.rawAttributes.email.type).toBe(DataTypes.STRING);
    expect(User.rawAttributes.email.allowNull).toBe(false);
    expect(User.rawAttributes.email.unique).toBe(true);
    expect(User.rawAttributes.email.validate.isEmail).toBe(true);
  });

  test('should have a password field of type STRING', () => {
    expect(User.rawAttributes.password.type).toBe(DataTypes.STRING);
    expect(User.rawAttributes.password.allowNull).toBe(false);
  });

  test('should have a role field of type STRING with a default value of "user"', () => {
    expect(User.rawAttributes.role.type).toBe(DataTypes.STRING);
    expect(User.rawAttributes.role.defaultValue).toBe('user');
  });

  test('should have an isValidated field of type BOOLEAN with a default value of false', () => {
    expect(User.rawAttributes.isValidated.type).toBe(DataTypes.BOOLEAN);
    expect(User.rawAttributes.isValidated.defaultValue).toBe(false);
  });

  test('should have a contactInfo field of type STRING with allowNull property', () => {
    expect(User.rawAttributes.contactInfo.type).toBe(DataTypes.STRING);
    expect(User.rawAttributes.contactInfo.allowNull).toBe(true);
  });

  test('should have the expected associations', () => {
    const associations = Object.keys(User.associations);
    expect(associations).toContain('Company');
    expect(associations).toContain('Website');
    expect(associations).toContain('Kpi');
    expect(associations).toContain('Graph');
    expect(associations).toContain('Heatmap');
  });

  test('should have the correct association properties for Company', () => {
    const companyAssociation = User.associations.Company;
    expect(companyAssociation.target.name).toBe('Company');
    expect(companyAssociation.foreignKey.name).toBe('userId');
    expect(companyAssociation.foreignKey.allowNull).toBe(false);
  });

  // Add tests for other associations (Website, Kpi, Graph, Heatmap) similarly

});