import scrapeIt from 'scrape-it';
import { zip } from 'lodash';
import fs from 'fs/promises';

const makeTargetYears = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, k) => k + from);

const crawl = async (from: number, to: number) => {
    const responses = await Promise.all(
        makeTargetYears(from, to).map(year => scrapeIt<{
            monthLabel: string[];
            approval: string[];
            disapproval: string[];
            periodsKey: string[];
            periods: string[];
        }>(`https://www.nhk.or.jp/bunken/yoron/political/${year}.html`, {
            monthLabel: {
                listItem: 'table.yoron-naikaku.view tr.month td',
            },
            approval: {
                listItem: 'table.yoron-naikaku.view tr:nth-child(2) td',
            },
            disapproval: {
                listItem: 'table.yoron-naikaku.view tr:nth-child(3) td',
            },
            periodsKey: {
                listItem: 'table.yoron-naikaku.gaiyo tr th:nth-child(1)',
            },
            periods: {
                listItem: 'table.yoron-naikaku.gaiyo tr th:nth-child(2)',
            },
        }))
    );
    const data = responses.map((res, i) => {
        const { monthLabel, approval, disapproval } = res.data;
        const periods = Object.fromEntries(zip(res.data.periodsKey, res.data.periods));
        const periodToDay = (period: string) => {
            const [ , month, day ] = period.match(/^(\d+)月\s?(\d+)日/);
            return `${month}月${day}日`;
        };
        const months = zip(monthLabel, approval, disapproval).map(monthData => {
            const period = periods[monthData[0]] || periods[monthData[0].match(/^(\d+月)/)[1]];
            return {
                year: from + i,
                month: parseInt(monthData[0].match(/^(\d+)月/)[1]),
                day: period && periodToDay(period),
                approval: parseInt(monthData[1]),
                disapproval: parseInt(monthData[2]),
            };
        });
        return months;
    }).flat().filter(d => !isNaN(d.approval));
    await fs.writeFile('./public/data/approval-rate.json', JSON.stringify(data));
};

crawl(2009, 2012);
