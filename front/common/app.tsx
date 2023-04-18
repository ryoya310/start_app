import useSWR from 'swr'
/**
 * @param num
 * 数値3ケタ区切り
 */
export const numberFormat = (num: Number) => {
  if (!num) return ''
  return num.toString().replace( /([0-9]+?)(?=(?:[0-9]{3})+$)/g , '$1,' )
}

export const formatDate = (d: any) => {
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const date = (d.getDate()).toString().padStart(2, '0')
  return `${d.getFullYear()}-${month}-${date}`
}

/**
 * @param datetime
 * DB日付フォーマット
 */
export const typeDateTime = (datetime?: string | null) => {
  let dt = new Date()
  if (datetime) {
    dt = new Date(datetime)
  }
  const [ year, month, day ] = [ dt.getFullYear(), toDigits(String(dt.getMonth()+1), 2), toDigits(String(dt.getDate()), 2) ]
  const [ hour, minutes, seconds ] = [ toDigits(String(dt.getHours()), 2), toDigits(String(dt.getMinutes()), 2), toDigits(String(dt.getSeconds()), 2) ]
  return {
    datetime: `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`,
    date: `${year}-${month}-${day}`,
    time: `${hour}:${minutes}:${seconds}`,
  }
}

/**
 * @param val
 * @param digit
 * 0パディング
 */
export const toDigits = (val: String, digit: Number) => {
  let zero = '0'
  for (let i = 1; i < Number(digit) - 1; i++) {
    zero += '0';
  }
  if (val.length < digit) { val = zero + val.slice(-1) }
  return val
}

/**
 * @param url
 */
export async function fetcher(url: string): Promise<boolean | null> {
  const response = await fetch(url)
  return response.json()
}

export const doFetch = async (url: string, request: any, callback?: (response: any) => void) => {
  const promise = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  })
  const response = await promise.json();
  console.log(response)
  if (callback) {
    callback(response)
  }
}

/**
 * @param url
 */
export const getData = (url: any, refreshInterval?: any, callback?: any) => {

  const ret: any = {
    data: {},
    error: {},
    mutate: '',
    show: Boolean,
  }

  const { data, error, mutate } = useSWR(url, fetcher, {
    refreshInterval: (refreshInterval) ? refreshInterval : 10000,
    onSuccess: async (data) => {
      
      if (callback) {
        return await callback(data)
      }
    }
  })

  ret.data = data
  ret.error = error
  ret.mutate = mutate
  ret.show = data !== undefined && error === undefined

  return ret
}

/**
 * @param datas
 * オブジェクト > クエリストリング
 */
export const serializeArray = (datas: any) => {
  let query = '?'
  Object.keys(datas).forEach(function(key) {
    if (Array.isArray(datas[key])) {
      datas[key].forEach(function(val: any, index: number) {
        query += `${key}=${val}&`
      })
    } else {
      query += `${key}=${datas[key]}&`
    }
  })
  return encodeURI(query.slice(0, -1))
}

/**
 * @param datas
 * オブジェクト > フォームデータ
 */
export const setFormData = (datas: any) => {
  let fd = new FormData()
  Object.keys(datas).forEach(function (key) {
    if (Array.isArray(datas[key])) {
      datas[key].forEach(function(val: any, index: number) {
        if (val) {
          fd.append(key, val)
        }
      })
    } else {
      if (datas[key]) {
        fd.append(key, datas[key])
      }
    }
  })
  return fd
}