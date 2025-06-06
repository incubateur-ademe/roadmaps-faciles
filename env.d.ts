// Auto-generated with "generateEnvDeclaration" script
/* eslint-disable */
declare namespace NodeJS {
    interface ProcessEnv {
        /**
         * Dist: `1`  
         * {@link [Local Env Dist](.env.development)}
         */
        NEXT_TELEMETRY_DISABLED?: string;
        /**
         * Dist: `dev`  
         * {@link [Local Env Dist](.env.development)}
         */
        APP_ENV?: string;
        /**
         * Dist: `false`  
         * {@link [Local Env Dist](.env.development)}
         */
        MAINTENANCE_MODE?: string;
        /**
         * Dist: `development`  
         * {@link [Local Env Dist](.env.development)}
         */
        NODE_ENV?: string;
        /**
         * Dist: `https://github.com/incubateur-ademe/roadmaps-faciles`  
         * {@link [Local Env Dist](.env.development)}
         */
        NEXT_PUBLIC_REPOSITORY_URL?: string;
        /**
         * Dist: `http://localhost:3000`  
         * {@link [Local Env Dist](.env.development)}
         */
        NEXT_PUBLIC_SITE_URL?: string;
        /**
         * Dist: `http://localhost:3000/api/auth`  
         * {@link [Local Env Dist](.env.development)}
         */
        AUTH_URL?: string;
        /**
         * Dist: `0`  
         * {@link [Local Env Dist](.env.development)}
         */
        AUTH_TRUST_HOST?: string;
        /**
         * Dist: `lilian.sagetlethias,julien.bouquillon`  
         * {@link [Local Env Dist](.env.development)}
         */
        ADMINS?: string;
        /**
         * No dist value.  
         * {@link [Local Env Dist](.env.development)}
         */
        ESPACE_MEMBRE_API_KEY?: string;
        /**
         * Dist: `https://espace-membre.incubateur.net`  
         * {@link [Local Env Dist](.env.development)}
         */
        ESPACE_MEMBRE_URL?: string;
        /**
         * Dist: `Roadmaps Faciles`  
         * {@link [Local Env Dist](.env.development)}
         */
        NEXT_PUBLIC_BRAND_NAME?: string;
        /**
         * Dist: `Créez vos roadmaps en quelques clics`  
         * {@link [Local Env Dist](.env.development)}
         */
        NEXT_PUBLIC_BRAND_TAGLINE?: string;
        /**
         * Dist: `République
Française`  
         * {@link [Local Env Dist](.env.development)}
         */
        NEXT_PUBLIC_BRAND_MINISTRY?: string;
        /**
         * Dist: `true`  
         * {@link [Local Env Dist](.env.development)}
         */
        NEXT_PUBLIC_BRAND_OPERATOR_ENABLE?: string;
        /**
         * Dist: `/img/roadmaps-faciles.png`  
         * {@link [Local Env Dist](.env.development)}
         */
        NEXT_PUBLIC_BRAND_OPERATOR_LOGO_URL?: string;
        /**
         * Dist: `Roadmaps Faciles`  
         * {@link [Local Env Dist](.env.development)}
         */
        NEXT_PUBLIC_BRAND_OPERATOR_LOGO_ALT?: string;
        /**
         * Dist: `vertical`  
         * {@link [Local Env Dist](.env.development)}
         */
        NEXT_PUBLIC_BRAND_OPERATOR_LOGO_ORIENTATION?: string;
        /**
         * Dist: `127.0.0.1`  
         * {@link [Local Env Dist](.env.development)}
         */
        MAILER_SMTP_HOST?: string;
        /**
         * Dist: `1025`  
         * {@link [Local Env Dist](.env.development)}
         */
        MAILER_SMTP_PORT?: string;
        /**
         * No dist value.  
         * {@link [Local Env Dist](.env.development)}
         */
        MAILER_SMTP_PASSWORD?: string;
        /**
         * No dist value.  
         * {@link [Local Env Dist](.env.development)}
         */
        MAILER_SMTP_LOGIN?: string;
        /**
         * Dist: `false`  
         * {@link [Local Env Dist](.env.development)}
         */
        MAILER_SMTP_SSL?: string;
        /**
         * Dist: `Roadmaps Faciles <noreply@roadmap.incubateur.net>`  
         * {@link [Local Env Dist](.env.development)}
         */
        MAILER_FROM_EMAIL?: string;
        /**
         * Dist: `sikretfordevonly`  
         * {@link [Local Env Dist](.env.development)}
         */
        SECURITY_JWT_SECRET?: string;
        /**
         * Dist: `="sikretfordevonly"`  
         * {@link [Local Env Dist](.env.development)}
         */
        SECURITY_WEBHOOK_SECRET?: string;
        /**
         * Dist: `roadmaps-faciles`  
         * {@link [Local Env Dist](.env.development)}
         */
        REDIS_BASE?: string;
        /**
         * Dist: `localhost`  
         * {@link [Local Env Dist](.env.development)}
         */
        REDIS_HOST?: string;
        /**
         * Dist: `6379`  
         * {@link [Local Env Dist](.env.development)}
         */
        REDIS_PORT?: string;
        /**
         * Dist: `false`  
         * {@link [Local Env Dist](.env.development)}
         */
        REDIS_TLS?: string;
        /**
         * No dist value.  
         * {@link [Local Env Dist](.env.development)}
         */
        REDIS_PASSWORD?: string;
        /**
         * Dist: `redis://localhost:6379`  
         * {@link [Local Env Dist](.env.development)}
         */
        REDIS_URL?: string;
        /**
         * Dist: `1`  
         * {@link [Local Env Dist](.env.development)}
         */
        NEXT_PUBLIC_MATOMO_SITE_ID?: string;
        /**
         * Dist: `http://localhost`  
         * {@link [Local Env Dist](.env.development)}
         */
        NEXT_PUBLIC_MATOMO_URL?: string;
        /**
         * Dist: `Admin`  
         * {@link [Local Env Dist](.env.development)}
         */
        SEED_ADMIN_NAME?: string;
        /**
         * Dist: `admin@example.com`  
         * {@link [Local Env Dist](.env.development)}
         */
        SEED_ADMIN_EMAIL?: string;
        /**
         * No dist value.  
         * {@link [Local Env Dist](.env.development)}
         */
        SEED_ADMIN_IMAGE?: string;
        /**
         * Dist: `admin`  
         * {@link [Local Env Dist](.env.development)}
         */
        SEED_ADMIN_USERNAME?: string;
        /**
         * Dist: `Le Site par Défaut`  
         * {@link [Local Env Dist](.env.development)}
         */
        SEED_TENANT_NAME?: string;
        /**
         * Dist: `default`  
         * {@link [Local Env Dist](.env.development)}
         */
        SEED_TENANT_SUBDOMAIN?: string;
        /**
         * Dist: `8`  
         * {@link [Local Env Dist](.env.development)}
         */
        SEED_MIN_FAKE_USERS?: string;
        /**
         * Dist: `16`  
         * {@link [Local Env Dist](.env.development)}
         */
        SEED_MAX_FAKE_USERS?: string;
        /**
         * Dist: `64`  
         * {@link [Local Env Dist](.env.development)}
         */
        SEED_MIN_FAKE_POSTS?: string;
        /**
         * Dist: `256`  
         * {@link [Local Env Dist](.env.development)}
         */
        SEED_MAX_FAKE_POSTS?: string;
        /**
         * Dist: `128`  
         * {@link [Local Env Dist](.env.development)}
         */
        SEED_MAX_FAKE_LIKES_PER_POST?: string;
        /**
         * Dist: `16`  
         * {@link [Local Env Dist](.env.development)}
         */
        SEED_MAX_FAKE_COMMENTS_PER_POST?: string;
        /**
         * Dist: `8`  
         * {@link [Local Env Dist](.env.development)}
         */
        SEED_MAX_REPLIES_PER_COMMENT?: string;
        /**
         * No dist value.  
         * {@link [Local Env Dist](.env.development)}
         */
        NEXT_PUBLIC_APP_VERSION?: string;
        /**
         * No dist value.  
         * {@link [Local Env Dist](.env.development)}
         */
        NEXT_PUBLIC_APP_VERSION_COMMIT?: string;
        /**
         * Dist: `localhost`  
         * {@link [Local Env Dist](.env.development)}
         */
        HOSTNAME?: string;
        /**
         * Dist: `3000`  
         * {@link [Local Env Dist](.env.development)}
         */
        PORT?: string;
        /**
         * No dist value.  
         * {@link [Local Env Dist](.env.development)}
         */
        CONTAINER_VERSION?: string;
        /**
         * Dist: `M`  
         * {@link [Local Env Dist](.env.development)}
         */
        CONTAINER_SIZE?: string;
        /**
         * No dist value.  
         * {@link [Local Env Dist](.env.development)}
         */
        CONTAINER_MEMORY?: string;
        /**
         * No dist value.  
         * {@link [Local Env Dist](.env.development)}
         */
        APP?: string;
        /**
         * No dist value.  
         * {@link [Local Env Dist](.env.development)}
         */
        STACK?: string;
        /**
         * No dist value.  
         * {@link [Local Env Dist](.env.development)}
         */
        REGION_NAME?: string;
        /**
         * No dist value.  
         * {@link [Local Env Dist](.env.development)}
         */
        SCALINGO_POSTGRESQL_URL?: string;
        /**
         * No dist value.  
         * {@link [Local Env Dist](.env.development)}
         */
        SCALINGO_REDIS_URL?: string;
    }
}
declare type ProcessEnvCustomKeys = 
    | 'NEXT_TELEMETRY_DISABLED'
    | 'APP_ENV'
    | 'MAINTENANCE_MODE'
    | 'NODE_ENV'
    | 'NEXT_PUBLIC_REPOSITORY_URL'
    | 'NEXT_PUBLIC_SITE_URL'
    | 'AUTH_URL'
    | 'AUTH_TRUST_HOST'
    | 'ADMINS'
    | 'ESPACE_MEMBRE_API_KEY'
    | 'ESPACE_MEMBRE_URL'
    | 'NEXT_PUBLIC_BRAND_NAME'
    | 'NEXT_PUBLIC_BRAND_TAGLINE'
    | 'NEXT_PUBLIC_BRAND_MINISTRY'
    | 'NEXT_PUBLIC_BRAND_OPERATOR_ENABLE'
    | 'NEXT_PUBLIC_BRAND_OPERATOR_LOGO_URL'
    | 'NEXT_PUBLIC_BRAND_OPERATOR_LOGO_ALT'
    | 'NEXT_PUBLIC_BRAND_OPERATOR_LOGO_ORIENTATION'
    | 'MAILER_SMTP_HOST'
    | 'MAILER_SMTP_PORT'
    | 'MAILER_SMTP_PASSWORD'
    | 'MAILER_SMTP_LOGIN'
    | 'MAILER_SMTP_SSL'
    | 'MAILER_FROM_EMAIL'
    | 'SECURITY_JWT_SECRET'
    | 'SECURITY_WEBHOOK_SECRET'
    | 'REDIS_BASE'
    | 'REDIS_HOST'
    | 'REDIS_PORT'
    | 'REDIS_TLS'
    | 'REDIS_PASSWORD'
    | 'REDIS_URL'
    | 'NEXT_PUBLIC_MATOMO_SITE_ID'
    | 'NEXT_PUBLIC_MATOMO_URL'
    | 'SEED_ADMIN_NAME'
    | 'SEED_ADMIN_EMAIL'
    | 'SEED_ADMIN_IMAGE'
    | 'SEED_ADMIN_USERNAME'
    | 'SEED_TENANT_NAME'
    | 'SEED_TENANT_SUBDOMAIN'
    | 'SEED_MIN_FAKE_USERS'
    | 'SEED_MAX_FAKE_USERS'
    | 'SEED_MIN_FAKE_POSTS'
    | 'SEED_MAX_FAKE_POSTS'
    | 'SEED_MAX_FAKE_LIKES_PER_POST'
    | 'SEED_MAX_FAKE_COMMENTS_PER_POST'
    | 'SEED_MAX_REPLIES_PER_COMMENT'
    | 'NEXT_PUBLIC_APP_VERSION'
    | 'NEXT_PUBLIC_APP_VERSION_COMMIT'
    | 'HOSTNAME'
    | 'PORT'
    | 'CONTAINER_VERSION'
    | 'CONTAINER_SIZE'
    | 'CONTAINER_MEMORY'
    | 'APP'
    | 'STACK'
    | 'REGION_NAME'
    | 'SCALINGO_POSTGRESQL_URL'
    | 'SCALINGO_REDIS_URL';