// config.js를 ts에서 사용하기 위해 존재
declare const _default: {
  APP_SECRET: string
  PROJECT_DIR: string
  DOMAIN_MYSQL_TYPE: 'mysql' | 'mariadb'
  DOMAIN_MYSQL_HOST: string
  DOMAIN_MYSQL_PORT: number
  DOMAIN_MYSQL_DB: string
  DOMAIN_MYSQL_USER: string
  DOMAIN_MYSQL_PASSWORD: string
  DOMAIN_MYSQL_SESSION_DB: string
}
export default _default
