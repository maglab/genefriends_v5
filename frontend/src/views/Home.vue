<template>
    <Header />
    <div class="gf-container p-my-6 p-py-6">
	    <BlockContent title="About">
			<p>GeneFriends employs a RNAseq based gene co-expression network for candidate gene prioritization, based on a seed list of genes, and for functional annotation of unknown genes in human, mouse and other model organisms.</p>
			<p>Human diseases have led to rapidly expanding research to understand their cause and find solutions. This has led to the association of many genes to these diseases. However, the underlying mechanisms often remain unknown or are unclear. There currently is a bias toward well studied genes and a tendency to ignore poorly annotated genes, which may be the missing pieces of the puzzle. By using the same pieces over and over again, we may be never able to see the complete picture of the disease under study. To identify new pieces and complete the puzzle we have created this online tool. This tool associates unstudied genes with well studied and disease related genes, by identifying which genes tend to work together. This can then be used to predict the function of unstudied genes adding new pieces to the puzzle.</p>
			<p>All data sets used during the study and for this web application can be downloaded from the following <strong><a href="https://www.dropbox.com/sh/jz0z3z8fuhx70fx/AACt3CUvyro2cEETVBoWwIrNa?dl=0" target="_blank">repository</a></strong>.</p>
		</BlockContent>
	    <BlockContent title="Uses">
			<p>For a comprehensive review of gene co-expression analysis please see: <strong><a href="https://academic.oup.com/bib/article/19/4/575/2888441" target="_blank" rel="noopener noreferrer" style="text-decoration: none;">link to article</a></strong></p>
		</BlockContent>
		<BlockContent title="Our Lab">
		    <p>Our group aims to help understand the genetic, cellular, and molecular mechanisms of ageing. Although our research integrates different strategies, its focal point is <strong>developing and applying experimental and computational methods that help bridge the gap between genotype and phenotype</strong>, a major challenge of the post-genome era, and help decipher the human genome and how it regulates ageing and longevity.</p>
		    <p>In the long term, we would like our work to contribute to the development of interventions that preserve health and combat disease by manipulating the ageing process. By studying the mechanisms of ageing <strong>our work could also have an impact on diseases, like cancer and neurodegenerative diseases, for which age is a major risk factor</strong>. No other biomedical field has so much potential to improve human health as research on the basic mechanisms of ageing.</p>
		    <p><strong>More information about the Integrative Genomics of Ageing Group</strong> of which this project is a part, please visit our website at 
		    	<a href="https://rejuvenomicslab.com/"
		           target="_blank">https://rejuvenomicslab.com/</a></p>
		</BlockContent>
		<BlockContent title="Change Log" nopadding>
			<div class="changeLogs">
				<ChangeLog :first="true"
						   version="5"
						   date="22.11.2021">
						<p class="p-mb-0">Release of <strong>the new geneFriends web app and database implemented in Neo4j</strong>, which encompasses tissue-specific gene co-expression networks for 20 human and 21 mouse tissues, dataset-specific gene co-expression maps based on TCGA and GTEx projects, and gene co-expression networks for additional 7 model organisms (Fruit fly, Zebrafish, Worm, Rat, Yeast, Cow, and Chicken).</p>
				</ChangeLog>
				<ChangeLog version="4"
						   date="30.07.2019">
						<p>Updated <strong>human and mouse co-expression networks</strong> constructed from 46475 and 34322 samples, respectively.</p>
				</ChangeLog>
				<ChangeLog :last="true"
						   version="3"
						   date="11.05.2015">
						<p>Updated <strong>mouse co-expression map</strong> (constructed from 4000 samples instead of 2500 samples).</p>
				</ChangeLog>
			</div>
		</BlockContent>
	</div>
	<Footer @changeColor="changeColor()" />
</template>

<script>
import Header from '../components/home_components/Header.vue'
import Footer from '../components/home_components/Footer.vue'
import ChangeLog from '../components/home_components/ChangeLog.vue'
import BlockContent from '../components/home_components/BlockContent.vue'
import { ref } from '@vue/reactivity'

export default {
	name: 'Home',
    components: { Header, Footer, ChangeLog, BlockContent },
	setup() {
		const flag = ref(false)
		
        const changeColor = () => {
            flag.value = true
        }


		return {
			changeColor,
			flag
		}
	}
}
</script>

<style scoped>
	main{
		padding: 0 4.5vw;
	}
	header p{
		font-weight: 800;
		font-size: 1.6em;
	}
	.changeLogs{
		display:grid;
		place-content: center;
	}
</style>