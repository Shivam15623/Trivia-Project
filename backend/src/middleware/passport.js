
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "../model/user.model.js";


const options = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    (req) => req?.cookies?.accessToken,
  ]),
  secretOrKey: process.env.ACCESS_TOKEN_SECRET,
};
const ConPassport = (passport) => {
  passport.use(
    new JwtStrategy(options, async (jwt_payload, done) => {
      const userId = jwt_payload._id;
      try {
        const user = await User.findById(userId);

        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (error) {
        return done(error, false);
      }
    })
  );
};

export default ConPassport;
