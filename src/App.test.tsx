import App, { isValidQQ } from "./App";
import renderer from "react-test-renderer";

test("valid input", () => {
	expect(isValidQQ("123456789")).toBe(true);
	expect(isValidQQ("a123456789")).toBe(false);
	expect(isValidQQ("01234")).toBe(false);
	expect(isValidQQ("abc")).toBe(false);
	expect(isValidQQ("  ")).toBe(false);
});

test("snapshot", () => {
	const tree: any = renderer.create(<App />).toJSON();
	expect(tree).toMatchSnapshot();
});

test("fetch with wrong qq value", async () => {
	const data = await fetch(`https://api.uomg.com/api/qq.info?qq=123`).then(
		(res) => res.json()
	);
	expect(data.code).not.toBe(1);
});

test("fetch with right qq value", async () => {
	const data = await fetch(`https://api.uomg.com/api/qq.info?qq=123456`).then(
		(res) => res.json()
	);
	expect(data.code).toBe(1);
	expect(data.qq).toBe("123456");
});
