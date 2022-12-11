import React from 'react'
import Link from 'next/link'
import FreeSewingIcon from 'shared/components/icons/freesewing.js'

const Breadcrumbs = ({ crumbs = [], title }) =>
  crumbs ? (
    <ul className="flex flex-row flex-wrap gap-2 font-bold">
      <li>
        <Link href="/" title="FreeSewing" className="text-base-content">
          <FreeSewingIcon />
        </Link>
      </li>
      {crumbs.map((crumb) => (
        <React.Fragment key={crumb[1] + crumb[0]}>
          <li className="text-base-content px-2">&raquo;</li>
          <li>
            {crumb[1] ? (
              <Link
                href={crumb[1]}
                title={crumb[0]}
                className="text-secondary hover:text-secondary-focus"
              >
                {crumb[0]}
              </Link>
            ) : (
              <span className="text-base-content">{crumb[0]}</span>
            )}
          </li>
        </React.Fragment>
      ))}
    </ul>
  ) : null

export default Breadcrumbs
