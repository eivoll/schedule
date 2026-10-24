import { useQuery } from "@apollo/client";
import type { ComponentType, ReactNode } from "react";
import {
  IconBook,
  IconDatabase,
  IconExternalLink,
  IconLayoutDashboard,
  IconSandbox,
  IconSettings,
} from "@tabler/icons-react";
// Root imports on purpose: core-ui shares `erxes-ui`/`ui-modules` as Module
// Federation singletons keyed on the bare specifier, so deep imports would
// bundle second private copies instead of reusing the host's.
import {
  Badge,
  Breadcrumb,
  Button,
  Card,
  Separator,
  Skeleton,
  cn,
} from "erxes-ui";
import { PageHeader } from "ui-modules";
import { Link } from "react-router";
import manifest from "../../../erxes.json" with { type: "json" };
import { STATUS_QUERY } from "../graphql";
import { Samples } from "../Samples";

const { path } = manifest.ui;

const Dot = ({ className }: { className?: string }) => (
  <span
    className={cn(
      "schedule:inline-block schedule:size-2 schedule:rounded-full",
      className,
    )}
  />
);

const StatusRow = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="schedule:flex schedule:items-center schedule:justify-between schedule:gap-4 schedule:text-sm">
    <span className="schedule:text-muted-foreground">{label}</span>
    <span className="schedule:flex schedule:items-center schedule:gap-2 schedule:font-medium">
      {children}
    </span>
  </div>
);

const ConnectionCard = () => {
  const { data, loading, error, refetch } = useQuery(STATUS_QUERY);
  const status = data?.scheduleStatus;

  const pending = (
    <>
      <Dot className="schedule:animate-pulse schedule:bg-muted-foreground" />
      <Skeleton className="schedule:h-4 schedule:w-24" />
    </>
  );

  return (
    <Card className="schedule:w-full schedule:md:w-80 schedule:shrink-0">
      <Card.Header>
        <Card.Title className="schedule:text-sm">Connection</Card.Title>
        <Card.Description>
          Live status of this plugin inside erxes
        </Card.Description>
      </Card.Header>
      <Card.Content className="schedule:flex schedule:flex-col schedule:gap-3">
        <StatusRow label="API">
          {loading ? (
            pending
          ) : error ? (
            <>
              <Dot className="schedule:bg-destructive" />
              <span>Unreachable</span>
              <Button variant="ghost" size="sm" onClick={() => refetch()}>
                Retry
              </Button>
            </>
          ) : (
            <>
              <Dot className="schedule:bg-success" />
              <span>Connected · v{status?.version}</span>
            </>
          )}
        </StatusRow>
        <StatusRow label="Gateway">
          {loading ? (
            pending
          ) : error ? (
            <>
              <Dot className="schedule:bg-destructive" />
              <span
                className="schedule:truncate schedule:max-w-40"
                title={error.message}
              >
                {error.message}
              </span>
            </>
          ) : (
            <>
              <Dot className="schedule:bg-success" />
              <span>Federated as {status?.plugin}</span>
            </>
          )}
        </StatusRow>
        <StatusRow label="Tenant">
          {loading ? pending : (status?.subdomain ?? "—")}
        </StatusRow>
        <StatusRow label="Signed in">
          {loading
            ? pending
            : (status && (status.userEmail ?? status.userId ?? "Anonymous")) ||
              "—"}
        </StatusRow>
      </Card.Content>
    </Card>
  );
};

const StepCard = ({
  icon: Icon,
  title,
  description,
  code,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  code: string;
}) => (
  <Card>
    <Card.Header>
      <div className="schedule:flex schedule:size-9 schedule:items-center schedule:justify-center schedule:rounded-lg schedule:bg-accent">
        <Icon className="schedule:size-5" />
      </div>
      <Card.Title>{title}</Card.Title>
      <Card.Description>{description}</Card.Description>
    </Card.Header>
    <Card.Content>
      <code className="schedule:rounded schedule:bg-muted schedule:px-1.5 schedule:py-0.5 schedule:font-mono schedule:text-xs">
        {code}
      </code>
    </Card.Content>
  </Card>
);

const STEPS = [
  {
    icon: IconDatabase,
    title: "Model your data",
    description:
      "Define the records this plugin owns and expose them on the federated graph.",
    code: "api/src/modules/sample",
  },
  {
    icon: IconLayoutDashboard,
    title: "Build the page",
    description:
      "Replace this overview with your module: lists with RecordTable, forms with Form, details in a Sheet.",
    code: "ui/src/pages/IndexPage.tsx",
  },
];

export const IndexPage = () => (
  <div className="schedule:flex schedule:h-full schedule:flex-col">
    <PageHeader>
      <PageHeader.Start>
        <Breadcrumb>
          <Breadcrumb.List className="schedule:gap-1">
            <Breadcrumb.Item>
              <Button variant="ghost" asChild>
                <Link to={`/${path}`}>
                  <IconSandbox />
                  {manifest.title}
                </Link>
              </Button>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb>
        <Separator.Inline />
        <PageHeader.FavoriteToggleButton
          breadcrumb={[manifest.title]}
          icon="IconSandbox"
        />
      </PageHeader.Start>
      <PageHeader.End>
        <Button variant="outline" asChild>
          <Link to={`/${path}/settings`}>
            <IconSettings />
            Settings
          </Link>
        </Button>
      </PageHeader.End>
    </PageHeader>
    <div className="schedule:flex-1 schedule:overflow-auto">
      <div className="schedule:mx-auto schedule:flex schedule:w-full schedule:max-w-5xl schedule:flex-col schedule:gap-6 schedule:p-6">
        <section className="schedule:relative schedule:overflow-hidden schedule:rounded-xl schedule:border schedule:border-border schedule:bg-background schedule:p-8 schedule:shadow-xs">
          <div
            aria-hidden
            className="schedule:pointer-events-none schedule:absolute schedule:inset-0 schedule:bg-gradient-to-br schedule:from-primary/10 schedule:via-transparent schedule:to-transparent"
          />
          <div className="schedule:relative schedule:flex schedule:flex-col schedule:gap-6 schedule:md:flex-row schedule:md:items-start schedule:md:justify-between">
            <div className="schedule:flex schedule:max-w-xl schedule:flex-col schedule:gap-4">
              <div>
                <Badge variant="info">Plugin · v{manifest.version}</Badge>
              </div>
              <h1 className="schedule:text-2xl schedule:font-semibold schedule:tracking-tight">
                Welcome to {manifest.title}
              </h1>
              <p className="schedule:text-sm schedule:leading-relaxed schedule:text-muted-foreground">
                {manifest.description}
              </p>
              <div className="schedule:flex schedule:flex-wrap schedule:gap-2">
                <Button asChild>
                  <Link to={`/${path}/settings`}>
                    <IconSettings />
                    Open settings
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <a
                    href="https://erxes.io/docs/create-plugin-standalone"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <IconBook />
                    Developer guide
                    <IconExternalLink />
                  </a>
                </Button>
              </div>
            </div>
            <ConnectionCard />
          </div>
        </section>
        <Samples />
        <div className="schedule:grid schedule:gap-4 schedule:md:grid-cols-2">
          {STEPS.map((step) => (
            <StepCard key={step.title} {...step} />
          ))}
        </div>
      </div>
    </div>
  </div>
);
