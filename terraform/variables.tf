locals {
  envs = { for tuple in regexall("(.*)=(.*)", file(".env")) : tuple[0] => sensitive(tuple[1]) }
}

variable "repository" {
  type        = string
  description = "github repo url"
  default     = "github.com/engjonah/weatheria"
}

variable "app_name" {
  type        = string
  description = "AWS Amplify App Name"
  default     = "weatheria"
}

variable "branch_name" {
  type        = string
  description = "AWS Amplify App Repo Branch Name"
  default     = "main"
}

variable "domain_name" {
  type        = string
  description = "AWS Amplify Domain Name"
  default     = "weatheria.tech"
}