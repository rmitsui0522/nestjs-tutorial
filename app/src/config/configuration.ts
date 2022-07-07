export default () => ({
  session: { secret: process.env.SESSION_SECRET },
  database: {
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    dbname: process.env.DATABASE_NAME,
    logging: false,
    synchronize: true,
  },
  auth: { jwt: { secret: process.env.JWT_SECRET, expiresIn: '1200s' } },
});
