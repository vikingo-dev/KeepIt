// Las interfaces llevaran al final del nombre el sufijo "Props"
// Los types llevaran al final del nombre el sufijo "Types"

export * from "./links"

interface LabelsI18nProps {
  [key: string]: string | LabelsI18nProps;
}

export type { LabelsI18nProps }