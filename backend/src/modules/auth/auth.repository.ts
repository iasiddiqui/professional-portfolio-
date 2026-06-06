import {
  mapUserWithPermissions,
  refreshTokenRepository,
  roleRepository,
  sessionRepository,
  userRepository,
  type UserWithRole,
} from '../../repositories/index.js';

export { mapUserWithPermissions, type UserWithRole };

export class AuthRepository {
  findUserByEmail = userRepository.findByEmail.bind(userRepository);
  findUserById = userRepository.findById.bind(userRepository);
  findActiveUserById = userRepository.findActiveById.bind(userRepository);
  findRoleByName = roleRepository.findByName.bind(roleRepository);
  createUser = userRepository.create.bind(userRepository);
  updatePassword = userRepository.updatePassword.bind(userRepository);
  emailExists = userRepository.emailExists.bind(userRepository);

  createSession = sessionRepository.create.bind(sessionRepository);
  findSessionByHash = sessionRepository.findByHash.bind(sessionRepository);
  findValidSessionByHash = sessionRepository.findValidByHash.bind(sessionRepository);
  touchSession = sessionRepository.touch.bind(sessionRepository);
  deleteSession = sessionRepository.delete.bind(sessionRepository);
  deleteAllUserSessions = sessionRepository.deleteAllForUser.bind(sessionRepository);

  createRefreshToken = refreshTokenRepository.create.bind(refreshTokenRepository);
  findRefreshTokenByHash = refreshTokenRepository.findByToken.bind(refreshTokenRepository);
  findValidRefreshToken = refreshTokenRepository.findValidByToken.bind(refreshTokenRepository);
  revokeRefreshToken = refreshTokenRepository.revokeToken.bind(refreshTokenRepository);
  revokeRefreshTokenFamily = refreshTokenRepository.revokeFamily.bind(refreshTokenRepository);
  revokeAllUserRefreshTokens = refreshTokenRepository.revokeAllForUser.bind(refreshTokenRepository);
  rotateRefreshToken = refreshTokenRepository.rotateToken.bind(refreshTokenRepository);
}

export const authRepository = new AuthRepository();
