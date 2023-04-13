import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'

const parseTheme = (theme: string): string | null => {
  try {
    const parsed = JSON.parse(theme)
    if (typeof parsed.version === 'undefined') {
      return null
    }
    if (parsed.version !== 2) {
      throw new Error('Invalid theme version')
    }

    const v1Theme = parsed.basic
    if (typeof v1Theme === 'undefined') {
      throw new Error('Invalid theme version')
    }

    return JSON.stringify(v1Theme, null, 2)
  } catch (e) {
    return null
  }
}

export const Main: React.FC = () => {
  const [before, setBefore] = useState<string>('')
  const [last, setLast] = useState<string | null>(null)
  const after = useMemo(() => parseTheme(before), [before])

  useEffect(() => {
    if (after !== null) {
      setLast(after)
    }
  }, [after])

  const beforeId = useId()
  const afterId = useId()
  const errorId = useId()

  const afterRef = useRef<HTMLTextAreaElement>(null)
  const selectAll = useCallback(() => {
    const { current } = afterRef
    if (current === null) {
      return
    }
    current.focus()
    current.select()
  }, [])

  const [copied, setCopied] = useState<'idle' | 'success' | 'error'>('idle')
  const copy = useCallback(() => {
    if (after === null) {
      return
    }
    navigator.clipboard
      .writeText(after)
      .then(() => {
        setCopied('success')
        setTimeout(() => setCopied('idle'), 1000)
      })
      .catch(() => {
        setCopied('error')
        setTimeout(() => setCopied('idle'), 1000)
      })
  }, [after])

  return (
    <section className='h-full'>
      <h2 className='font-bold text-2xl my-4'>変換</h2>
      <div className='grid grid-cols-1 md:grid-cols-[1fr_max-content_1fr] grid-rows-[auto_max-content_auto] w-full h-full'>
        <label
          className='flex flex-col glassmorphism p-4 rounded-lg'
          htmlFor={beforeId}
        >
          v2 テーマ
          <span className='block invisible' aria-hidden>
            ⚠ 変換エラー
          </span>
          <textarea
            id={beforeId}
            value={before}
            onChange={e => setBefore(e.target.value)}
            className='font-mono h-full border-2'
          />
        </label>
        <div className='self-center mx-4'>
          <span className='hidden md:block'>➾</span>
          <span className='md:hidden'>⇓</span>
        </div>
        <label
          className='flex flex-col glassmorphism p-4 rounded-lg'
          htmlFor={afterId}
        >
          変換後 (v1 テーマ)
          <button
            disabled={after === null}
            onClick={copy}
            className='self-end glassmorphism rounded-md px-2 py-1 hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed focus:outline-2 focus:outline-black'
          >
            {copied === 'idle'
              ? 'コピー'
              : copied === 'success'
              ? 'コピーしました'
              : 'コピーに失敗しました'}
          </button>
          <span
            id={errorId}
            aria-hidden={after !== null}
            className={`${
              after !== null ? 'invisible' : ''
            } text-red-500 self-end`}
          >
            ⚠ 変換エラー
          </span>
          <textarea
            id={afterId}
            value={after ?? last ?? ''}
            readOnly
            aria-describedby={errorId}
            className='font-mono h-full border-2'
            ref={afterRef}
            onFocus={selectAll}
          />
        </label>
      </div>
    </section>
  )
}
