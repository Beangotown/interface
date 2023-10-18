import roleCommon from 'assets/base64/role';
import roleHalloween from 'assets/base64/roleHalloween';

export const Avatar: Record<string, string> = {
  'BEANPASS-1': require('assets/images/me-avatar.png').default.src,
  'BEANPASS-2': require('assets/images/me-avatar-halloween.png').default.src,
};

export const RoleImg: Record<string, string> = {
  'BEANPASS-1': roleCommon,
  'BEANPASS-2': roleHalloween,
};

export const DEFAULT_SYMBOL = 'BEANPASS-1';
