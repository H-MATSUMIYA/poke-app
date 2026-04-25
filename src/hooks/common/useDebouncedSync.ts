import { useState, useEffect } from 'react';

/**
 * 外部の状態（URLなど）と同期しつつ、
 * 入力時はデバウンスして反映させるカスタムフック
 * 
 * @param externalValue 外部から渡される値（PropsやURLなど）
 * @param onDebouncedChange 値が確定した時に呼ばれるコールバック
 * @param delay デバウンスの待機時間 (ms)
 */
export function useDebouncedSync<T>(
  externalValue: T,
  onDebouncedChange: (val: T) => void,
  delay = 300
) {
  const [localValue, setLocalValue] = useState(externalValue);

  // 1. プロパティ（URLなど）が外部から変更された場合に同期
  useEffect(() => {
    setLocalValue(externalValue);
  }, [externalValue]);

  // 2. デバウンス処理: 入力が止まってから一定時間後に外部の状態を更新
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== externalValue) {
        onDebouncedChange(localValue);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [localValue, externalValue, onDebouncedChange, delay]);

  return [localValue, setLocalValue] as const;
}
