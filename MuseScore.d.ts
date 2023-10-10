export type Instrument = {
    Channel: {
        program: string;
        synti: string;
    };
    clef: string;
    instrumentId: string;
    longName: string;
    maxPitchA: number;
    maxPitchP: number;
    minPitchA: number;
    minPitchP: number;
    shortName: string;
    singleNoteDynamics: 0 | 1;
    trackName: string;
};

export type Part = {
    Instrument: Instrument;
    Staff: {
        StaffType: {
            name: string;
        };
    };
    preferSharpFlat: string; // 'none'
    trackName: string;
};

export type Staff = {
    Measure: {
        voice: {
            KeySig: {
                concertKey: number;
            };
            Rest: {
                durationType: string;
                duration: string;
            };
            Tempo: {
                tempo: number;
                folowText: 0 | 1;
                bold: 0 | 1;
                text: {
                    b: ({
                        font: string;
                        '#text': string;
                    } | '')[];
                    sym: string;
                };
            };
            TimeSig: {
                sigD: number;
                sigN: number;
            };
        };
    };
    VBox?: {
        height: number;
        boxAutoSize: number;
        Text: {
            style: string;
            text: string;
        };
    };
};

export type Score = {
    Division: number;
    Part: Part[];
    Staff: Staff[];
    layoutMode: string;
    metaTag: string[];
    open: 0 | 1;
    showFrames: 0 | 1;
    showInvisible: 0 | 1;
    showMargins: 0 | 1;
    showUnprintable: 0 | 1;
};

export type MuseScore = {
    Score: Score;
    programRevision: string;
    programVersion: string;
};
