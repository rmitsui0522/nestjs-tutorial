export default () => ({
  session: { secret: 'SESSION_SECRET' },
  database: {
    type: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    username: 'user',
    password: 'password',
    dbname: 'dev',
    logging: false,
    synchronize: true,
  },
  auth: { jwt: { secret: 'JWT_SECRET', expiresIn: '1200s' } },
});
