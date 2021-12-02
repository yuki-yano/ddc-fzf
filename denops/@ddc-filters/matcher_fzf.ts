import {
  BaseFilter,
  Candidate,
} from "https://deno.land/x/ddc_vim@v0.13.0/types.ts#^";

export class Filter extends BaseFilter<{}> {
  async filter(args: {
    completeStr: string;
    candidates: Candidate[];
  }): Promise<Candidate[]> {
    const input = args.completeStr;

    const p = Deno.run({
      cmd: ["fzf", "--no-sort", "--filter", input],
      stdin: "piped",
      stdout: "piped",
    });

    await p.stdin.write(
      new TextEncoder().encode(args.candidates.map((c) => c.word).join("\n")),
    );
    p.stdin.close();

    const output = new TextDecoder().decode(await p.output());
    p.close();

    return output.split("\n").map((v) => ({ word: v }));
  }

  params(): {} {
    return {};
  }
}
