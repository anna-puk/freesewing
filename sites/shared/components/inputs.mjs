// Dependencies
import { cloudflareImageUrl } from 'shared/utils.mjs'
import { collection } from 'shared/hooks/use-design.mjs'
// Context
import { ModalContext } from 'shared/context/modal-context.mjs'
// Hooks
import { useState, useCallback, useContext } from 'react'
import { useTranslation } from 'next-i18next'
import { useDropzone } from 'react-dropzone'
// Components
import { Popout } from 'shared/components/popout/index.mjs'
import Markdown from 'react-markdown'
import { ResetIcon, DocsIcon, HelpIcon } from 'shared/components/icons.mjs'
import { ModalWrapper } from 'shared/components/wrappers/modal.mjs'
import { isDegreeMeasurement } from 'config/measurements.mjs'
import { measurementAsMm, formatMm, measurementAsUnits, parseDistanceInput } from 'shared/utils.mjs'

//import { Collapse } from 'shared/components/collapse.mjs'
//import { PlusIcon, EditIcon } from 'shared/components/icons.mjs'
//import { NumberInput } from 'shared/components/workbench/menus/shared/inputs.mjs'
//import { useState, useCallback } from 'react'

export const ns = ['account', 'measurements', 'designs']

/*
 * Helper component to display a tab heading
 */
export const Tab = ({
  id, // The tab ID
  label, // A label for the tab, if not set we'll use the ID
  activeTab, // Which tab (id) is active
  setActiveTab, // Method to set the active tab
}) => (
  <button
    className={`text-lg font-bold capitalize tab tab-bordered grow
    ${activeTab === id ? 'tab-active' : ''}`}
    onClick={() => setActiveTab(id)}
  >
    {label ? label : id}
  </button>
)

/*
 * Helper component to wrap a form control with a label
 */
export const FormControl = ({
  label, // the (top-left) label
  children, // Children to go inside the form control
  docs = false, // Optional top-right label
  labelBL = false, // Optional bottom-left label
  labelBR = false, // Optional bottom-right label
}) => {
  const { setModal } = useContext(ModalContext)

  return (
    <div className="form-control w-full mt-2">
      <label className={`label pb-0 ${docs ? 'hover:cursor-help' : ''}`}>
        <span className="label-text text-lg font-bold mb-0">{label}</span>
        {docs ? (
          <span className="label-text-alt">
            <button
              className="btn btn-ghost btn-sm btn-circle hover:btn-secondary"
              onClick={() =>
                setModal(
                  <ModalWrapper flex="col" justify="top lg:justify-center" slideFrom="right">
                    {docs}
                  </ModalWrapper>
                )
              }
            >
              <DocsIcon />
            </button>
          </span>
        ) : null}
      </label>
      {children}
      {labelBL || labelBR ? (
        <label className="label">
          {labelBL ? <span className="label-text-alt">Bottom Left label</span> : null}
          {labelBR ? <span className="label-text-alt">Bottom Right label</span> : null}
        </label>
      ) : null}
    </div>
  )
}

/*
 * Helper method to wrap content in a button
 */
export const ButtonFrame = ({
  children, // Children of the button
  onClick, // onClick handler
  active, // Whether or not to render the button as active/selected
}) => (
  <button
    className={`
    btn btn-ghost btn-secondary
    w-full mt-2 py-4 h-auto
    border-2 border-secondary text-left bg-opacity-20
    hover:bg-secondary hover:text-secondary-content hover:border-secondary hover:border-solid hover:border-2
    ${active ? 'bg-secondary border-solid' : 'bg-transparent border-dotted'}
    `}
    onClick={onClick}
  >
    {children}
  </button>
)

/*
 * Input for strings
 */
export const StringInput = ({
  label, // Label to use
  update, // onChange handler
  valid, // Method that should return whether the value is valid or not
  current, // The current value
  original, // The original value
  placeholder, // The placeholder text
  docs = false, // Docs to load, if any
}) => {
  const { setModal } = useContext(ModalContext)

  const labelTR = docs ? (
    <button
      className="btn btn-secondary btn-outline"
      onClick={() =>
        setModal(
          <ModalWrapper flex="col" justify="top lg:justify-center" slideFrom="left">
            {docs}
          </ModalWrapper>
        )
      }
    >
      <DocsIcon />
    </button>
  ) : (
    false
  )

  return (
    <FormControl label={label} docs={docs}>
      <input
        type="text"
        placeholder={placeholder}
        value={current}
        onChange={(evt) => update(evt.target.value)}
        className={`input w-full input-bordered ${
          current === original
            ? 'input-secondary'
            : valid(current)
            ? 'input-success'
            : 'input-error'
        }`}
      />
    </FormControl>
  )
}

/*
 * Dropdown for designs
 */
export const DesignDropdown = ({
  label, // Label to use
  update, // onChange handler
  current, // The current value
  docs = false, // Docs to load, if any
  firstOption = null, // Any first option to add in addition to designs
}) => {
  const { t, i18n } = useTranslation(['designs'])
  console.log(i18n)

  return (
    <FormControl label={label} docs={docs}>
      <select
        className="select select-bordered w-full"
        onChange={(evt) => update(evt.target.value)}
      >
        {firstOption}
        {collection.map((design) => (
          <option key={design} value={design}>
            {t(`${design}.t`)}
          </option>
        ))}
      </select>
    </FormControl>
  )
}

/*
 * Input for an image that is passive (it does not upload the image)
 */
export const PassiveImageInput = ({
  label, // The label
  update, // The onChange handler
  current, // The current value
  original, // The original value
  docs = false, // Docs to load, if any
}) => {
  const { t } = useTranslation(ns)

  const onDrop = useCallback(
    (acceptedFiles) => {
      const reader = new FileReader()
      reader.onload = async () => {
        update(reader.result)
      }
      acceptedFiles.forEach((file) => reader.readAsDataURL(file))
    },
    [current]
  )

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  if (current)
    return (
      <FormControl label={label} docs={docs}>
        <div
          className="bg-base-100 w-full h-36 mb-2 mx-auto flex flex-col items-center text-center justify-center"
          style={{
            backgroundImage: `url(${current})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '50%',
          }}
        >
          <button
            className="btn btn-neutral btn-circle opacity-50 hover:opacity-100"
            onClick={() => update(original)}
          >
            <ResetIcon />
          </button>
        </div>
      </FormControl>
    )

  return (
    <FormControl label={label} docs={docs}>
      <div
        {...getRootProps()}
        className={`
        flex rounded-lg w-full flex-col items-center justify-center
        lg:p-6 lg:border-4 lg:border-secondary lg:border-dashed
      `}
      >
        <input {...getInputProps()} />
        <p className="hidden lg:block p-0 m-0">{t('imgDragAndDropImageHere')}</p>
        <p className="hidden lg:block p-0 my-2">{t('or')}</p>
        <button className={`btn btn-secondary btn-outline mt-4 px-8`}>{t('imgSelectImage')}</button>
      </div>
      <p className="p-0 my-2 text-center">{t('or')}</p>
      <div className="flex flex-row items-center">
        <input
          type="url"
          className="input input-secondary w-full input-bordered"
          placeholder={t('imgPasteUrlHere')}
          value={current}
          onChange={(evt) => update(evt.target.value)}
        />
      </div>
    </FormControl>
  )
}

/*
 * Input for a list of things to pick from
 */
export const ListInput = ({
  update, // the onChange handler
  label, // The label
  list, // The list of items to present { val, label, desc }
  current, // The (value of the) current item
  original, // The original value
  docs = false, // Docs to load, if any
}) => (
  <FormControl label={label} docs={docs}>
    {list.map((item, i) => (
      <ButtonFrame key={i} active={item.val === current} onClick={() => update(item.val)}>
        <div className="w-full flex flex-col gap-2">
          <div className="w-full text-lg leading-5">{item.label}</div>
          <div className="w-full text-normal font-normal normal-case pt-1 leading-5">
            {item.desc}
          </div>
        </div>
      </ButtonFrame>
    ))}
  </FormControl>
)

/*
 * Input for markdown content
 */
export const MarkdownInput = ({
  label, // The label
  current, // The current value (markdown)
  original, // The original value
  update, // The onChange handler
  placeholder, // The placeholder content
  docs = false, // Docs to load, if any
}) => {
  const { t } = useTranslation(ns)
  const [activeTab, setActiveTab] = useState('edit')

  return (
    <FormControl label={label} docs={docs}>
      <div className="tabs w-full">
        {['edit', 'preview'].map((tab) => (
          <Tab id={tab} key={tab} label={tab} {...{ activeTab, setActiveTab }} />
        ))}
      </div>
      <div className="flex flex-row items-center mt-4">
        {activeTab === 'edit' ? (
          <textarea
            rows="5"
            className="textarea textarea-bordered textarea-lg w-full"
            value={current}
            placeholder={placeholder}
            onChange={(evt) => update(evt.target.value)}
          />
        ) : (
          <div className="text-left px-4 border w-full">
            <Markdown>{current}</Markdown>
          </div>
        )}
      </div>
    </FormControl>
  )
}

const Mval = ({ m, val = false, imperial = false, className = '' }) =>
  val ? (
    isDegreeMeasurement(m) ? (
      <span className={className}>{val}°</span>
    ) : (
      <span
        dangerouslySetInnerHTML={{ __html: formatMm(val, imperial ? 'imperial' : 'metric') }}
        className={className}
      />
    )
  ) : null

const heightClasses = {
  2: 'h-12',
  4: 'h-10',
  8: 'h-8',
  16: 'h-6',
  32: 'h-4',
}

export const MeasieInput = ({
  imperial, // True for imperial, False for metric
  m, // The measurement name
  current, // The current value
  original, // The original value
  update, // The onChange handler
  placeholder, // The placeholder content
  docs = false, // Docs to load, if any
}) => {
  const { t } = useTranslation(['measurements'])
  const isDegree = isDegreeMeasurement(m)
  const units = imperial ? 'imperial' : 'metric'

  const [localVal, setLocalVal] = useState(
    typeof original === 'undefined' ? original : measurementAsUnits(original, units)
  )
  const [validatedVal, setValidatedVal] = useState(measurementAsUnits(original, units))

  const [val, setVal] = useState(() => {
    const measie = current
    if (!measie) return ''
    if (isDegree) return measie
    return measurementAsUnits(measie, units)
  })
  const [valid, setValid] = useState(null)

  // Update onChange
  const localUpdate = (newVal) => {
    setLocalVal(newVal)
    const parsedVal = parseDistanceInput(newVal, imperial)
    if (parsedVal) {
      update(m, isDegree ? parsedVal : measurementAsMm(parsedVal, units))
      setValid(true)
      setValidatedVal(parsedVal)
    } else setValid(false)
  }

  if (!m) return null

  // Various visual indicators for validating the input
  let inputClasses = 'input-secondary'
  let bottomLeftLabel = null
  let bottomRightLabel = null
  if (valid === true) {
    inputClasses = 'input-success'
    const val = `${validatedVal}${isDegree ? '°' : imperial ? '"' : 'cm'}`
    bottomLeftLabel = (
      <span className="label-text-alt font-medium text-success text-base">{val}</span>
    )
  } else if (valid === false) {
    inputClasses = 'input-error'
    bottomLeftLabel = (
      <span className="label-text-alt font-medium text-error text-base">¯\_(ツ)_/¯</span>
    )
  }

  /*
   * I'm on the fence here about using a text input rather than number
   * Obviously, number is the more correct option, but when the user enter
   * text, it won't fire an onChange event and thus they can enter text and it
   * will not be marked as invalid input.
   * See: https://github.com/facebook/react/issues/16554
   */
  return (
    <FormControl label={t(m)} docs={docs}>
      <input
        type="number"
        placeholder={placeholder}
        value={localVal}
        onChange={(evt) => localUpdate(evt.target.value)}
        className={`input w-full input-bordered ${inputClasses}`}
      />
      <label className="label -mt-1">{bottomLeftLabel}</label>
    </FormControl>
  )
}
