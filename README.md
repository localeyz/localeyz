# Localeyz Bundle Architecture

## Table of Contents

1. [Introduction](#introduction)
2. [Installation Guide](#installation-guide)
3. [Migrations Guide](#migrations-guide)
4. [Endpoints](#endpoints)
5. [Hooks](#hooks)
6. [Useful links](#Useful-links)

## Introduction

Localeyz is a powerful platform designed to streamline the localization process for websites, enabling businesses to effortlessly reach global audiences by providing multilingual content solutions. This repository houses a [Directus](https://docs.directus.io/) extension specifically tailored for Localeyz, empowering developers to seamlessly integrate and manage multilingual content within the Directus ecosystem.

With the Localeyz Directus Extension, developers can enhance their Directus Enterprise instances by effortlessly incorporating Localeyz's robust localization capabilities. By leveraging this extension, organizations can efficiently manage and deploy localized content across their websites, ensuring a consistent and engaging experience for users worldwide.

Whether you're a developer looking to enhance your Directus projects with advanced localization features or a business seeking to expand your global reach, the Localeyz Directus Extension offers a versatile solution to streamline your localization workflow.

## Installation Guide

### Pre-requisites

- NodeJs v18.16.0
- PostgreSQL 15.1

### Installation Steps

1. Clone the repository with `git clone`.
2. Run `cp .env.example .env` to copy the config file. Then, you'll need to set the `DB_*` variables. The other variables you can leave how they are.
3. Navigate to the directory and install dependencies with `pnpm install`.
4. Also install dependency on bundle by rooting into `./custom/bundles/localeyz` by executing `pnpm install` command.
5. For the First-time setup, you need to create a database structure using `pnpm run setup-db`.
6. Now generate the build file using `pnpm run build`.
7. To start the project locally run `pnpm run start`.
8. To start the project on the server run `pnpn run stag`.

## Migrations Guide

### Applying the latest Database structure (using [Directus snapshot](https://docs.directus.io/self-hosted/cli.html#migrate-schema-to-a-different-environment))

Run `pnpm run directus:schema:apply`

### Storing the current Database Structure (using [Directus snapshot](https://docs.directus.io/self-hosted/cli.html#migrate-schema-to-a-different-environment))

Run `npm run directus:schema:snapshot`

# How to create a new extension in bundle

Navigate to the `custom/bundles/localeyz/src` directory. Here is where we keep all our custom extension source code.

Create the new file for the custom extension in the respective directory structure inside the `.src/routes` and create `controller` file (actual logic), `daos` file (database queries). Add commonly used code into the `utils` file structure.

In your bundle's `package.json` file, the `directus:extension` object has an entries array that describes all of the items contained within the bundle.

Example of an entry:

```json
{
  "type": "interface",
  "name": "my-interface",
  "source": "src/my-interface/index.ts"
}
```

Entries in a bundle are located within a src directory in the bundle.

After that, go to your bundle directory and run pnpm build. This command will watch all your changes and compile your extensions into the output folder.

## Endpoints

#### SSO

- **Description:** This endpoint is for the SSO Login

```https
  POST /sso/login
```

| Parameter         | Type           | Description                            |
| :---------------- | :------------- | :------------------------------------- |
| `id`              | `string(body)` | User ID (UUID)                         |
| `email`           | `string(body)` | User Email (String)                    |
| `organization`    | `string(body)` | Organization ID (Integer)              |
| `role`            | `string(body)` | Role of User (UUID)                    |
| `expiresDateTime` | `string(body)` | Session expire Date Time (TimeStamp)   |
| `accessToken`     | `string(body)` | accessToken to create session (String) |

#### Telvue

- **Description:** This endpoint is for the telvue sync of episodes with hypercaster

```https
  POST /telvue
```

| Parameter        | Type           | Description                 |
| :--------------- | :------------- | :-------------------------- |
| `episodes`       | `string(body)` | Episode ID (Integer)        |
| `accountability` | `string(body)` | Login User Details (Object) |

## Hooks

### Delete AWS Video

This hook automates the process of removing video files from the `Episodes` table that are stored in AWS S3 and have surpassed a 7-day threshold, ensuring efficient management of storage resources.

### Global Image

This hook enhances content management by seamlessly transforming URLs of third-party images into actual image files. The converted images are then securely stored within the Directus storage system, facilitating easier access and management.

### Podcasts

This hook streamlines the management of `Podcasts` content by actively monitoring RSS feeds. Upon creation or modification of a podcast, it dynamically updates associated podcast episodes. Additionally, it handles the transformation of third-party image URLs into image files, storing them securely within the Directus storage environment.

### S3 to File Library

This hook plays a pivotal role in content enrichment by generating thumbnail images of the `Episodes` table from designated thumbnail URLs. These thumbnail images provide visual representations of corresponding files, enhancing user interaction and navigation within the system.

### Users

This hook ensures seamless synchronization of `directus_users` data by managing the linkage between users and their associated linked users. Whether it involves the creation, modification, or deletion of a user profile, this hook guarantees that the linked user data remains updated and consistent across the platform.

## Useful links

- [Directus config variables](https://docs.directus.io/self-hosted/config-options.html)
- [Extension Bundles](https://docs.directus.io/extensions/bundles.html)
- [Creating an extension](https://docs.directus.io/extensions/creating-extensions.html#scaffolding-your-directus-extension)
