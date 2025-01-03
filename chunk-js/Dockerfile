FROM node:23 AS base
ENV PNPM_HOME=/pnpm
ENV PATH="${PNPM_HOME}/bin:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM build AS dev
EXPOSE 3000
#CMD ["bash"]
CMD ["pnpm", "dev"]