import Dexie from 'dexie';

const db = new Dexie('InfoHub');
db.version(1).stores({
  infos: `++info_id,platform,platform_type,info_created_at,info_updated_at`
});
db.version(1).stores({
  platform_users: `++platform_user_id,platform`
});
db.version(1).stores({
  configs: `++id,name,platform,platform_type,type,value`
});

export default db;
