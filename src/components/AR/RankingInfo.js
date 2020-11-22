import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import Link from 'react-router-dom/Link'
import { highscoresUrl } from '../../routes'

const TeaserItem = props => (
  <div
    className="column is-one-quarter-desktop is-half-tablet"
    style={{ flexDirection: 'column' }}
  >
    <Link to={props.link}>
      <div className="hero is-primary is-bold" style={{ height: '100%' }}>
        <div className="hero-body">
          <h1 className="title">{props.title}</h1>
          <h2 className="subtitle">{props.subtitle}</h2>
        </div>
      </div>
    </Link>
  </div>
)

const TeaserItemExt = props => (
  <div
    className="column is-one-quarter-desktop is-half-tablet"
    style={{ flexDirection: 'column' }}
  >
    <a href={props.link} target="_blank" rel="noopener noreferrer">
      <div className="hero is-primary is-bold" style={{ height: '100%' }}>
        <div className="hero-body">
          <h1 className="title">{props.title}</h1>
          <h2 className="subtitle">{props.subtitle}</h2>
        </div>
      </div>
    </a>
  </div>
)

class RankingInfo extends Component {
  shouldComponentUpdate() {
    return false
  }

  render() {
    return (
      <div>
        <Helmet>
          <meta
            name="description"
            content="General information about the AirRivals Ranking project & AceOnline Tools"
          />
          <title>AR/AO Tools/Stats</title>
        </Helmet>

        <h1 className="title">AirRivals/AceOnline Tools & Stats</h1>

        <div className="columns is-multiline">
          <TeaserItem
            link="/ranking/fbtool"
            title="FrameBreak Tool"
            subtitle="Std. weapon opti"
          />
          <TeaserItem
            link="/ranking/statcalc"
            title="StatCalc"
            subtitle="Build stats"
          />
          <TeaserItemExt
            link="https://github.com/kronthto/ao-archive"
            title="AO Fileformat"
            subtitle="Archive (un-)packer"
          />
          <TeaserItemExt
            link="https://github.com/DrDelay/GambleBot"
            title="GambleBot"
            subtitle="Bruteforce lab gambling"
          />
        </div>

        <hr />
        <h2 className="title">AirRivals.de Prokyon Ranking</h2>

        <p>
          <Link to={highscoresUrl}>
            <strong>Highscores</strong> - The ladder for any given day
          </Link>
        </p>

        <section className="section">
          <h3 className="title">Motivation</h3>
          <p>
            AirRivals, the EU Version of Masangsofts Aceonline (former{' '}
            <abbr title="Space Cowboy Online">SCO</abbr>), published the
            highscores once a day and only of the current day. It was not
            possible to view previous days.
          </p>
          <p>
            Therefore, in 2012 I wrote a program that saves the data once a day,
            and this website to make it publicly accessible, aswell as
            performing deeper analysis on the data (progress/day,
            Nation-balance).
          </p>
        </section>

        <section className="section">
          <h3 className="title">Dataset</h3>
          <p>
            The first day data was recorded is the 2012-07-27, since then up to
            the 2016-08-24 - the day AR.de closed its gates - 1163 days are
            recorded. Unfortunately, mostly in the beginning, some days are
            missing, because the import wasn't stable. Since the 2014-01-05
            every day is on record.
          </p>
        </section>

        <section className="section">
          <h3 className="title">Methodology</h3>
          <p>
            AR.de published 5 tables every day: level, fame, brigade_total,
            brigade_monthly, pvp (duels). These were copied without
            modification/normalization into the same schema. All processing for
            views is done using joins on these tables.
          </p>
        </section>

        <section className="section">
          <h3 className="title">Data</h3>
          <p>
            If you want to dig into the records yourself you are encouraged to!
            All historical data is directly available:
          </p>
          <p>
            <a
              href="http://cdn.vi0lation.de/files/prokyon_2012_07_27_to_2016_08_24.7z"
              title="Prokyon Ranking Dump"
            >
              Download the MySQL Dump
            </a>
          </p>
          <p>
            Use the API as this website does (CORS is enabled):{' '}
            <a
              href="https://github.com/kronthto/api.vi0lation.de#endpoints"
              title="Ranking-Data api.vi0lation.de GitHub"
            >
              api.vi0lation.de
            </a>
          </p>
        </section>
      </div>
    )
  }
}

export default RankingInfo
