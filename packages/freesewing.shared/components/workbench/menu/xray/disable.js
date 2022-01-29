import { useState } from 'react'
import { linkClasses } from 'shared/components/navigation/primary.js'

const DisableXray = props => (
  <li className="flex flex-row">
    <button className={`
      flex flex-row
      w-full
      justify-between
      px-2
      text-left
      text-base-content
      sm:text-neutral-content
      items-center
      pr-6
    `} onClick={() => props.updateGist(['xray', 'enabled'], false)}>
      <div className={`
        grow pl-2 border-l-2
        ${linkClasses}
        hover:cursor-pointer
        hover:border-secondary
        sm:hover:border-secondary-focus
        text-base-content sm:text-neutral-content
      `}>
        <span className={`
          text-3xl mr-2 inline-block p-0 pl-2 leading-3
          translate-y-3
        `}>
          <>&deg;</>
        </span>
        <span>
          {props.app.t('cfp.thingIsEnabled', { thing: props.app.t('settings.xray.title') })}
        </span>
      </div>
    </button>
  </li>
)

export default DisableXray
