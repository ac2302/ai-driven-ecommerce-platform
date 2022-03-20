module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '765ba2efc70f9078098135c83e3d61fc'),
  },
});
