type LMerge<T1, T2> = {
   [k in keyof T1]: k extends keyof T2 ? T2[k] : T1[k];
};

interface PossibleGenerics {
   Output?: unknown;
   Error?: unknown;
   ResultResolverController?: unknown;
   ErrorResolverController?: unknown;
}

type Generics = Required<PossibleGenerics>;

// T - is the generics from Generics that are set
// Defaults - are default Generics that are applied to children
interface NodeItem<T extends Generics, Defaults extends Generics> {
   // S - is a subset of generics from Generics that are set, including none: {}
   // NewDefaults - any changes to Defaults.
   <
      S extends PossibleGenerics = {},
      NewDefaults extends PossibleGenerics = {},
      UpdatedDefaults extends Generics = LMerge<Defaults, NewDefaults>,
      Child extends Generics = LMerge<UpdatedDefaults, S>, // generics and Defaults applied
   >(): NodeItem<Child, UpdatedDefaults>;
   NodeItem: T;
}

const example = {} as NodeItem<
   {
      Output: string;
      Error: string;
      ResultResolverController: string;
      ErrorResolverController: string;
   },
   Generics
>;
const exampleUsage1 = example<{ Output: number }, { Error: Error }>();
const exampleUsage2 = exampleUsage1<{ Output: number }>();
const exampleUsage3 = exampleUsage2<{ Output: number }>();
const exampleUsage4 = exampleUsage3<{ Output: number }>();
const exampleUsage5 = exampleUsage4<{ Output: number }>();
const exampleUsage6 = exampleUsage5<{ Output: number }>();
const exampleUsage7 = exampleUsage6<{ Output: number }>();
const exampleUsage8 = exampleUsage7<{ Output: number }>();
const exampleUsage9 = exampleUsage8<{ Output: number }>();
const exampleUsage10 = exampleUsage9<{ Output: number }>();
const exampleUsage11 = exampleUsage10<{ Output: number }>();

const lazy = () => {
   const exampleUsage12 = exampleUsage11<{ Output: number }>();
};
//
//
