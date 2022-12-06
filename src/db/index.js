/*
 * @Author      : Mr.bin
 * @Date        : 2022-06-23 09:03:32
 * @LastEditTime: 2022-12-06 21:50:56
 * @Description : Dexie
 */
import Dexie from 'dexie'

export function initDB() {
  const db = new Dexie('Energy_N14_E13_Standalone_Leg_Up') // 与项目名保持一致
  db.version(1).stores({
    user: 'userId,userName',
    test_data: '++,userId,pdfTime,[userId+pdfTime]',
    train_data:
      '++,userId,pdfTime,trainPart,trainType,[userId+pdfTime],[userId+trainType],[trainType+trainPart]',
    mtt_data:
      '++,userId,pdfTime,mttPart,mttType,[userId+pdfTime],[userId+mttType],[mttType+mttPart]'
  })
  return db
}
