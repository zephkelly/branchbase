type UUIDBinary = [bigint, bigint];

const UUIDRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export class UUIDv7 {
    static readonly UUID7_VERSION = 0b0111;
    static readonly UUID7_VARIANT = 0b10;
    static readonly VER_LEN = 4;
    static readonly RAND_A_LEN = 12;
    static readonly VAR_LEN = 2;
    static readonly RAND_B_LEN = 62;
    static readonly TIMESTAMP_SHIFT = BigInt(UUIDv7.VER_LEN + UUIDv7.RAND_A_LEN);
    static readonly MAX_SEQ = -1 ^ (-1 << UUIDv7.RAND_A_LEN);

    private static readonly RAND_A_MASK = BigInt("0xfff");
    private static readonly RAND_B_MASK = BigInt("0x3fffffffffffffff");
    private static readonly VER = BigInt(UUIDv7.UUID7_VERSION) << BigInt(UUIDv7.RAND_A_LEN);
    private static readonly VAR = BigInt(UUIDv7.UUID7_VARIANT) << BigInt(UUIDv7.RAND_B_LEN);

    private sequenceOffset = BigInt(0);
    private lastTimestamp = BigInt(-1);
    private sequence = BigInt(0);
    private value: string | null = null;

    constructor(sequence = 0) {
        if (sequence < 0 || sequence > 4095) {
            throw new Error(`Sequence must be between 0 and 4095, got ${sequence}`);
        }
        this.sequenceOffset = BigInt(sequence);
        this.sequence = BigInt(sequence);
    }

    // Override toJSON to return the UUID string
    toJSON(): string {
        if (!this.value) {
            this.value = this.generate();
        }
        return this.value;
    }

    // Override toString to return the UUID string
    toString(): string {
        return this.toJSON();
    }

    static isValid(uuid: string): boolean {
        return UUIDRegex.test(uuid);
    }

    static parse(uuid: string) {
        if (!UUIDv7.isValid(uuid)) throw new Error("Invalid UUID");
        const hex = uuid.replace(/-/g, "");
        const left = BigInt(`0x${hex.slice(0, 16)}`);
        const right = BigInt(`0x${hex.slice(16)}`);
        const timestamp = Number(left >> UUIDv7.TIMESTAMP_SHIFT);
        const version = Number((left >> BigInt(UUIDv7.RAND_A_LEN)) & BigInt(0xf));
        const randA = left & UUIDv7.RAND_A_MASK;
        const variant = Number(right >> BigInt(UUIDv7.RAND_B_LEN));
        const randB = right & UUIDv7.RAND_B_MASK;
        return {
            timestamp,
            version,
            variant,
            randA: randA.toString(10),
            randB: randB.toString(10),
            binary: [left, right],
        };
    }

    generate(): string {
        let [left, right] = this.generateBinary().map((x) => x.toString(16).padStart(16, "0"));
        left = `${left?.slice(0, 8)}-${left?.slice(8, 12)}-${left?.slice(12, 16)}`;
        right = `${right?.slice(0, 4)}-${right?.slice(4)}`;
        this.value = `${left}-${right}`;
        return this.value;
    }

    generateBinary(): UUIDBinary {
        const [timestamp, sequence] = this.getTimestampAndSequence();
        const randB = this.getRandomByte();
        return [(timestamp << UUIDv7.TIMESTAMP_SHIFT) | UUIDv7.VER | sequence, UUIDv7.VAR | randB];
    }

    private getRandomByte(): bigint {
        const buff = new BigUint64Array(1);
        crypto.getRandomValues(buff);
        if (buff[0] === undefined) {
            throw new Error("Failed to generate random number");
        }
        
        return buff[0] & UUIDv7.RAND_B_MASK;
    }

    private getTimestampAndSequence(): [bigint, bigint] {
        let currentTimestamp = BigInt(Date.now());
        if (currentTimestamp < this.lastTimestamp) {
            throw new Error(
                `Clock moved backwards. Refusing to generate id until ${this.lastTimestamp}.`,
            );
        }
        if (currentTimestamp === this.lastTimestamp) {
            this.sequence = (this.sequence + BigInt(1)) & BigInt(UUIDv7.MAX_SEQ);
            if (this.sequence === BigInt(0)) {
                currentTimestamp = this.waitTillNextMillis();
                this.sequence = this.sequenceOffset;
            }
        } else {
            this.sequence = this.sequenceOffset;
        }
        this.lastTimestamp = currentTimestamp;
        return [this.lastTimestamp, this.sequence];
    }

    private waitTillNextMillis(): bigint {
        let timestamp = BigInt(Date.now());
        while (timestamp <= this.lastTimestamp) {
            timestamp = BigInt(Date.now());
        }
        return timestamp;
    }
}
