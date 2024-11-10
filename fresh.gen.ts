// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from "./routes/_404.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $api_joke from "./routes/api/joke.ts";
import * as $greet_name_ from "./routes/greet/[name].tsx";
import * as $index from "./routes/index.tsx";
import * as $Chart from "./islands/Chart.tsx";
import * as $Menu from "./islands/Menu.tsx";
import * as $Pagination from "./islands/Pagination.tsx";
import * as $Selection from "./islands/Selection.tsx";
import * as $pages_CostsHistory from "./islands/pages/CostsHistory.tsx";
import * as $pages_IncomeHistory from "./islands/pages/IncomeHistory.tsx";
import * as $pages_Interest from "./islands/pages/Interest.tsx";
import * as $pages_Matrix from "./islands/pages/Matrix.tsx";
import * as $pages_Monthly from "./islands/pages/Monthly.tsx";
import * as $pages_NetProgress from "./islands/pages/NetProgress.tsx";
import * as $pages_Yearly from "./islands/pages/Yearly.tsx";
import type { Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/_404.tsx": $_404,
    "./routes/_app.tsx": $_app,
    "./routes/api/joke.ts": $api_joke,
    "./routes/greet/[name].tsx": $greet_name_,
    "./routes/index.tsx": $index,
  },
  islands: {
    "./islands/Chart.tsx": $Chart,
    "./islands/Menu.tsx": $Menu,
    "./islands/Pagination.tsx": $Pagination,
    "./islands/Selection.tsx": $Selection,
    "./islands/pages/CostsHistory.tsx": $pages_CostsHistory,
    "./islands/pages/IncomeHistory.tsx": $pages_IncomeHistory,
    "./islands/pages/Interest.tsx": $pages_Interest,
    "./islands/pages/Matrix.tsx": $pages_Matrix,
    "./islands/pages/Monthly.tsx": $pages_Monthly,
    "./islands/pages/NetProgress.tsx": $pages_NetProgress,
    "./islands/pages/Yearly.tsx": $pages_Yearly,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
