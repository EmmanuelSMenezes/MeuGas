export interface StepOption {
  id: number,
  label: string,
  tab: string,
  component: () => React.ReactNode,
  action: () => void,
}
