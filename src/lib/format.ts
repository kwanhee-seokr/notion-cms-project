/**
 * 데이터 포맷 유틸리티
 */

/**
 * 날짜를 한국어 형식으로 포맷
 */
export function formatDate(
  date: string | Date,
  format: 'long' | 'short' | 'numeric' = 'long'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  if (isNaN(dateObj.getTime())) {
    return '-'
  }

  switch (format) {
    case 'long':
      return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(dateObj)

    case 'short':
      return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(dateObj)

    case 'numeric':
      return dateObj.toISOString().split('T')[0]

    default:
      return dateObj.toLocaleDateString('ko-KR')
  }
}

/**
 * 금액을 한국 원화(KRW) 형식으로 포맷
 */
export function formatCurrency(
  amount: number,
  options?: {
    showSymbol?: boolean
    showWon?: boolean
  }
): string {
  const { showSymbol = true, showWon = false } = options || {}

  if (isNaN(amount)) {
    return showSymbol ? '₩0' : '0원'
  }

  const formatted = new Intl.NumberFormat('ko-KR').format(amount)

  if (showSymbol) {
    return `₩${formatted}`
  }

  if (showWon) {
    return `${formatted}원`
  }

  return formatted
}

/**
 * 할인율 포맷
 */
export function formatDiscountRate(rate: number): string {
  return `${rate}%`
}

/**
 * 배송비 포맷
 */
export function formatShipping(
  shipping: number,
  freeShipping: boolean
): string {
  if (freeShipping) return '무료배송'
  if (shipping === 0) return '무료배송'
  return `배송비 ${new Intl.NumberFormat('ko-KR').format(shipping)}원`
}
